package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swapcloset.backend.converter.FavoritoMapper;
import org.swapcloset.backend.converter.ProductoMapper;
import org.swapcloset.backend.dto.CartaProductoDTO;
import org.swapcloset.backend.dto.FavoritoDTO;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.modelos.*;
import org.swapcloset.backend.repository.FavoritoRepository;
import org.swapcloset.backend.repository.ProductoRepository;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final FavoritoMapper favoritoMapper;
    private final ProductoMapper productoMapper;
    private final ProductoRepository productoRepository;
    private final ProductoService productoService;
    private final RaitingService raitingService;

    @PersistenceContext
    private final EntityManager em;

    @Transactional(readOnly = true)
    public List<FavoritoDTO> findAll() {
        return favoritoRepository.findAll().stream()
                .map(favoritoMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<ProductoDTO> findProductosFavoritosByUsuarioId(Integer usuarioId) {
        return productoRepository.findProductosFavoritosByUsuarioId(usuarioId).stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CartaProductoDTO> findCartaProductosFavoritosByUsuarioId(Integer usuarioId) {
        List<Producto> productos = productoRepository.findProductosFavoritosByUsuarioId(usuarioId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return productos.stream().map(producto -> {
            CartaProductoDTO dto = new CartaProductoDTO();

            // Producto
            dto.setProductoId(producto.getId());
            dto.setTipo(producto.getTipo() != null ? producto.getTipo().toString() : null);
            dto.setPrecio(producto.getPrecio() != null ? producto.getPrecio().toString() : null);
            dto.setTitulo(producto.getTitulo());
            dto.setEstado(producto.getEstado());
            dto.setTalla(producto.getTalla());
            dto.setFechaDevolucion(producto.getFechaDevolucion() != null ?
                    producto.getFechaDevolucion().format(formatter) : null);
            dto.setFechaCreacion(producto.getFechaCreacion() != null ?
                    producto.getFechaCreacion().format(formatter) : null);
            dto.setActivo(producto.getActivo());

            // Imagen principal del producto
            String imagenUrl = null;
            if (producto.getImagenes() != null && !producto.getImagenes().isEmpty()) {
                // Obtener la primera imagen por orden ascendente
                imagenUrl = producto.getImagenes().stream()
                        .sorted(Comparator.comparing(ImagenProducto::getOrden))
                        .findFirst()
                        .map(ImagenProducto::getUrlImg)
                        .orElse(null);
            }
            dto.setUrlImgProducto(imagenUrl);

            // Usuario
            Usuario usuario = producto.getUsuario();
            if (usuario != null) {
                dto.setUsuarioId(usuario.getId());
                dto.setNombreUsuario(usuario.getNombre());
                dto.setApellidosUsuario(usuario.getApellidos());
                dto.setUrlImgUsuario(usuario.getUrlImg());
                dto.setUbicacionUsuario(usuario.getDireccion());
            }

            // Raiting (puedes calcularlo según tu servicio)
            dto.setRaiting(raitingService.obtenerMediaPuntuacionUsuario(usuario.getId()));

            return dto;
        }).collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public Integer findCountFavoritosByUsuarioId(Integer usuarioId) {
        Double count = favoritoRepository.findCountFavoritosByUsuarioId(usuarioId);
        return count != null ? count.intValue() : 0;
    }


    @Transactional(readOnly = true)
    public Optional<FavoritoDTO> findById(FavoritoId id) {
        return favoritoRepository.findById(id).map(favoritoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<FavoritoDTO> findByUsuarioId(Integer usuarioId) {
        return favoritoRepository.findByUsuario_Id(usuarioId).stream()
                .map(favoritoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FavoritoDTO> findByProductoId(Integer productoId) {
        return favoritoRepository.findByProducto_Id(productoId).stream()
                .map(favoritoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoritoDTO save(FavoritoDTO dto) {
        if (dto == null) throw new IllegalArgumentException("FavoritoDTO no debe ser null");
        if (dto.getIdUsuario() == null || dto.getIdProducto() == null)
            throw new IllegalArgumentException("idUsuario e idProducto son obligatorios");

        // evitar duplicados
        if (favoritoRepository.existsByUsuario_IdAndProducto_Id(dto.getIdUsuario(), dto.getIdProducto())) {
            throw new IllegalArgumentException("Ya existe ese favorito");
        }

        Favorito entity = favoritoMapper.toEntity(dto);
        Usuario usuarioRef = em.getReference(Usuario.class, dto.getIdUsuario());
        Producto productoRef = em.getReference(Producto.class, dto.getIdProducto());
        entity.setUsuario(usuarioRef);
        entity.setProducto(productoRef);

        Favorito saved = favoritoRepository.save(entity);
        return favoritoMapper.toDTO(saved);
    }

    @Transactional
    public FavoritoDTO update(FavoritoDTO dto) {
        if (dto == null) throw new IllegalArgumentException("FavoritoDTO no debe ser null");
        if (dto.getIdUsuario() == null || dto.getIdProducto() == null)
            throw new IllegalArgumentException("idUsuario e idProducto son obligatorios para actualizar");

        FavoritoId id = new FavoritoId(dto.getIdUsuario(), dto.getIdProducto());
        Favorito existente = favoritoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe Favorito con id: " + id));

        // no permitir cambiar la clave compuesta (si en el futuro se aceptara, habría que gestionar delete+create)
        if ((dto.getIdUsuario() != null && !dto.getIdUsuario().equals(existente.getId().getIdUsuario()))
                || (dto.getIdProducto() != null && !dto.getIdProducto().equals(existente.getId().getIdProducto()))) {
            throw new IllegalArgumentException("No se permite cambiar idUsuario o idProducto de un favorito existente");
        }

        // Actualiza campos no nulos (el mapper no modifica relaciones)
        favoritoMapper.updateEntityFromDTO(dto, existente);

        // asegurar referencias gestionadas (mismas ids)
        existente.setUsuario(em.getReference(Usuario.class, existente.getId().getIdUsuario()));
        existente.setProducto(em.getReference(Producto.class, existente.getId().getIdProducto()));

        Favorito updated = favoritoRepository.save(existente);
        return favoritoMapper.toDTO(updated);
    }

    @Transactional
    public void deleteByUserAndProduct(Integer idUsuario, Integer idProducto) {
        if (idUsuario == null || idProducto == null) return;
        favoritoRepository.deleteByUsuario_IdAndProducto_Id(idUsuario, idProducto);
    }

    @Transactional
    public void deleteById(FavoritoId id) {
        if (id == null) return;
        favoritoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByUserAndProduct(Integer idUsuario, Integer idProducto) {
        if (idUsuario == null || idProducto == null) return false;
        return favoritoRepository.existsByUsuario_IdAndProducto_Id(idUsuario, idProducto);
    }

    @Transactional(readOnly = true)
    public boolean existsById(FavoritoId id) {
        return id != null && favoritoRepository.existsById(id);
    }
}