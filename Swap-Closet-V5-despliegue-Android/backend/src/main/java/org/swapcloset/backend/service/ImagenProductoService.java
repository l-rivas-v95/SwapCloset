package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.converter.ImagenProductoMapper;
import org.swapcloset.backend.dto.ImagenProductoDTO;
import org.swapcloset.backend.modelos.ImagenProducto;
import org.swapcloset.backend.modelos.Producto;
import org.swapcloset.backend.repository.ImagenProductoRepository;
import org.swapcloset.backend.repository.ProductoRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImagenProductoService {

    private final ImagenProductoRepository imagenProductoRepository;
    private final ImagenProductoMapper imagenProductoMapper;
    private final ProductoRepository productoRepository;

    @PersistenceContext
    private final EntityManager em;


    @Transactional(readOnly = true)
    public List<ImagenProductoDTO> findAll() {
        return imagenProductoRepository.findAll().stream()
                .map(imagenProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public String getPrimeraImagen(Integer id) {
        return imagenProductoRepository.getPrimeraImagen(id);
    }

    @Transactional(readOnly = true)
    public Optional<ImagenProductoDTO> findById(Integer id) {
        return imagenProductoRepository.findById(id).map(imagenProductoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ImagenProductoDTO> findByProductoId(Integer productoId) {

        Producto producto = em.find(Producto.class, productoId);
        if (producto == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No existe el producto con id: " + productoId);
        }

        // Inicializa la relación LAZY automáticamente
        List<ImagenProducto> imagenes = producto.getImagenes();

        return imagenProductoMapper.toDTOsList(imagenes);
    }

    @Transactional(readOnly = true)
    public Page<ImagenProductoDTO> findByProductoId(Integer productoId, Pageable pageable) {
        return imagenProductoRepository.findByProducto_Id(productoId, pageable)
                .map(imagenProductoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ImagenProductoDTO> findByProductoIdOrderByOrdenAsc(Integer productoId) {
        return imagenProductoRepository.findByProducto_IdOrderByOrdenAsc(productoId).stream()
                .map(imagenProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ImagenProductoDTO> findPrincipalByProductoId(Integer productoId) {
        return imagenProductoRepository.findTopByProducto_IdOrderByOrdenAsc(productoId)
                .map(imagenProductoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<ImagenProductoDTO> findByProductoIdAndOrden(Integer productoId, Integer orden) {
        return imagenProductoRepository.findByProducto_IdAndOrden(productoId, orden)
                .map(imagenProductoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public boolean existsByProductoIdAndOrden(Integer productoId, Integer orden) {
        return imagenProductoRepository.existsByProducto_IdAndOrden(productoId, orden);
    }

    @Transactional(readOnly = true)
    public List<ImagenProductoDTO> findByUrlFragment(String fragment) {
        return imagenProductoRepository.findByUrlImgContainingIgnoreCase(fragment).stream()
                .map(imagenProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ImagenProductoDTO guardarOActualizarPrincipal(Integer idProducto, String ruta) {

        if (idProducto == null || ruta == null || ruta.isBlank()) {
            throw new IllegalArgumentException("Datos inválidos");
        }

        ImagenProducto imagen = imagenProductoRepository
                .findByProductoIdAndOrden(idProducto, 1)
                .orElseGet(() -> {
                    ImagenProducto nueva = new ImagenProducto();
                    nueva.setOrden(1);
                    nueva.setProducto(em.getReference(Producto.class, idProducto));
                    return nueva;
                });

        // 👉 PISAR la ruta
        imagen.setUrlImg(ruta);

        ImagenProducto saved = imagenProductoRepository.save(imagen);
        return imagenProductoMapper.toDTO(saved);
    }


    @Transactional
    public ImagenProductoDTO save(ImagenProductoDTO dto) {

        if (!productoRepository.existsById(dto.getIdProducto())) {
            throw new IllegalArgumentException("El ID del producto no existe");
        }

        ImagenProducto entity = imagenProductoMapper.toEntity(dto);

        Producto productoRef = em.getReference(Producto.class, dto.getIdProducto());
        entity.setProducto(productoRef);

        ImagenProducto saved = imagenProductoRepository.save(entity);  // Aquí sí puede fallar
        return imagenProductoMapper.toDTO(saved);
    }


    @Transactional
    public ImagenProductoDTO update(ImagenProductoDTO dto) {
        if (dto == null || dto.getId() == null)
            throw new IllegalArgumentException("ImagenProductoDTO y su id no deben ser null");

        ImagenProducto existente = imagenProductoRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("No existe ImagenProducto con id: " + dto.getId()));

        // Actualización manual de campos permitidos
        if (dto.getUrlImg() != null) {
            existente.setUrlImg(dto.getUrlImg());
        }

        ImagenProducto updated = imagenProductoRepository.saveAndFlush(existente);

//        // Construir el DTO manualmente para evitar problemas de serialización
//        ImagenProductoDTO result = new ImagenProductoDTO();
//        result.setId(updated.getId());
//        result.setUrlImg(updated.getUrlImg());
//        result.setOrden(updated.getOrden());
//        result.setIdProducto(updated.getProducto() != null ? updated.getProducto().getId() : null);

        return imagenProductoMapper.toDTO(updated);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (id == null) return;
        imagenProductoRepository.deleteById(id);
    }

    @Transactional
    public void deleteByProductoId(Integer productoId) {
        if (productoId == null) return;
        imagenProductoRepository.deleteByProducto_Id(productoId);
    }

    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return id != null && imagenProductoRepository.existsById(id);
    }
}