package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swapcloset.backend.converter.ProductoHistoricoMapper;
import org.swapcloset.backend.dto.ProductoHistoricoDTO;
import org.swapcloset.backend.modelos.*;
import org.swapcloset.backend.repository.ProductoHistoricoRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoHistoricoService {

    private final ProductoHistoricoRepository productoHistoricoRepository;
    private final ProductoHistoricoMapper productoHistoricoMapper;

    @PersistenceContext
    private EntityManager em;

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findAll() {
        return productoHistoricoRepository.findAll().stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findAvailableProducts() {
        return productoHistoricoRepository.findByFechaDevolucionIsNull().stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProductoHistoricoDTO> findById(Integer id) {
        return productoHistoricoRepository.findById(id)
                .map(productoHistoricoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByProductoId(Integer idProducto) {
        if (idProducto == null) return List.of();
        return productoHistoricoRepository.findByProducto_Id(idProducto).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByUsuarioId(Integer usuarioId) {
        if (usuarioId == null) return List.of();
        return productoHistoricoRepository.findByUsuario_Id(usuarioId).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductoHistoricoDTO> findByUsuarioId(Integer usuarioId, Pageable pageable) {
        if (usuarioId == null) return Page.empty();
        return productoHistoricoRepository.findByUsuario_Id(usuarioId, pageable)
                .map(productoHistoricoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByTipo(TipoProducto tipo) {
        if (tipo == null) return List.of();
        return productoHistoricoRepository.findByTipo(tipo).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductoHistoricoDTO> findByTipo(TipoProducto tipo, Pageable pageable) {
        if (tipo == null) return Page.empty();
        return productoHistoricoRepository.findByTipo(tipo, pageable)
                .map(productoHistoricoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByAccion(AccionHistorico accion) {
        if (accion == null) return List.of();
        return productoHistoricoRepository.findByAccion(accion).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductoHistoricoDTO> findByAccion(AccionHistorico accion, Pageable pageable) {
        if (accion == null) return Page.empty();
        return productoHistoricoRepository.findByAccion(accion, pageable)
                .map(productoHistoricoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> searchByTitulo(String titulo) {
        if (titulo == null || titulo.isBlank()) return List.of();
        return productoHistoricoRepository.findByTituloContainingIgnoreCase(titulo).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> searchByEstilo(String estilo) {
        if (estilo == null || estilo.isBlank()) return List.of();
        return productoHistoricoRepository.findByEstiloContainingIgnoreCase(estilo).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByCategoria(String categoria) {
        if (categoria == null) return List.of();
        return productoHistoricoRepository.findByCategoria(categoria).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByMarca(String marca) {
        if (marca == null) return List.of();
        return productoHistoricoRepository.findByMarca(marca).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByTalla(String talla) {
        if (talla == null) return List.of();
        return productoHistoricoRepository.findByTalla(talla).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByColor(String color) {
        if (color == null) return List.of();
        return productoHistoricoRepository.findByColorIgnoreCase(color).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByPrecioRange(BigDecimal min, BigDecimal max) {
        if (min == null || max == null) return List.of();
        return productoHistoricoRepository.findByPrecioBetween(min, max).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByFechaDevolucionIsNull() {
        return productoHistoricoRepository.findByFechaDevolucionIsNull().stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByFechaDevolucionBefore(LocalDateTime fecha) {
        if (fecha == null) return List.of();
        return productoHistoricoRepository.findByFechaDevolucionBefore(fecha).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByFechaCreacionBefore(LocalDateTime fecha) {
        if (fecha == null) return List.of();
        return productoHistoricoRepository.findByFechaCreacionBefore(fecha).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoHistoricoDTO> findByFechaCreacionAfter(LocalDateTime fecha) {
        if (fecha == null) return List.of();
        return productoHistoricoRepository.findByFechaCreacionAfter(fecha).stream()
                .map(productoHistoricoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Variante que devuelve entidades (si se necesita internamente)
    @Transactional(readOnly = true)
    public List<ProductoHistorico> findEntitiesByProductoIdAndAccion(Integer idProducto, AccionHistorico accion) {
        if (idProducto == null || accion == null) return List.of();
        return productoHistoricoRepository.findByProducto_IdAndAccion(idProducto, accion);
    }

    @Transactional
    public ProductoHistoricoDTO save(ProductoHistoricoDTO dto) {
        if (dto == null) throw new IllegalArgumentException("ProductoHistoricoDTO no debe ser null");

        if (dto.getPrecio() != null) {
            dto.setPrecio(dto.getPrecio().setScale(2, RoundingMode.HALF_UP));
        }

        ProductoHistorico entity = productoHistoricoMapper.toEntity(dto);

        if (dto.getIdUsuario() != null) {
            Usuario usuarioRef = em.getReference(Usuario.class, dto.getIdUsuario());
            entity.setUsuario(usuarioRef);
        } else {
            entity.setUsuario(null);
        }

        ProductoHistorico saved = productoHistoricoRepository.save(entity);
        return productoHistoricoMapper.toDTO(saved);
    }

    @Transactional
    public ProductoHistoricoDTO update(ProductoHistoricoDTO dto) {
        if (dto == null || dto.getId() == null)
            throw new IllegalArgumentException("ProductoHistoricoDTO y su id no deben ser null");

        ProductoHistorico existente = productoHistoricoRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("No existe ProductoHistorico con id: " + dto.getId()));

        if (dto.getPrecio() != null) {
            dto.setPrecio(dto.getPrecio().setScale(2, RoundingMode.HALF_UP));
        }

        productoHistoricoMapper.updateEntityFromDTO(dto, existente);

        if (dto.getIdUsuario() != null) {
            existente.setUsuario(em.getReference(Usuario.class, dto.getIdUsuario()));
        }

        ProductoHistorico updated = productoHistoricoRepository.save(existente);
        return productoHistoricoMapper.toDTO(updated);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (id == null) return;
        productoHistoricoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return id != null && productoHistoricoRepository.existsById(id);
    }
}