package org.swapcloset.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.modelos.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface ProductoHistoricoRepository extends JpaRepository<ProductoHistorico, Integer> {

    List<ProductoHistorico> findByProducto_Id(Integer id);
    List<ProductoHistorico> findByUsuario_Id(Integer usuarioId);
    Page<ProductoHistorico> findByUsuario_Id(Integer usuarioId, Pageable pageable);
    List<ProductoHistorico> findByTipo(TipoProducto tipo);
    Page<ProductoHistorico> findByTipo(TipoProducto tipo, Pageable pageable);
    List<ProductoHistorico> findByAccion(AccionHistorico accion);
    Page<ProductoHistorico> findByAccion(AccionHistorico accion, Pageable pageable);
    List<ProductoHistorico> findByTituloContainingIgnoreCase(String titulo);
    List<ProductoHistorico> findByEstiloContainingIgnoreCase(String estilo);
    List<ProductoHistorico> findByCategoria(String categoria);
    List<ProductoHistorico> findByMarca(String marca);
    List<ProductoHistorico> findByTalla(String talla);
    List<ProductoHistorico> findByColorIgnoreCase(String color);
    List<ProductoHistorico> findByPrecioBetween(BigDecimal precioMin, BigDecimal precioMax);
    List<ProductoHistorico> findByFechaDevolucionIsNull();
    List<ProductoHistorico> findByFechaDevolucionBefore(LocalDateTime fecha);
    List<ProductoHistorico> findByFechaCreacionBefore(LocalDateTime fecha);
    List<ProductoHistorico> findByFechaCreacionAfter(LocalDateTime fecha);
    List<ProductoHistorico> findByProducto_IdAndAccion(Integer idProducto, AccionHistorico accion);
}