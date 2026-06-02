package org.swapcloset.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.modelos.ImagenProducto;

import java.util.List;
import java.util.Optional;
@Repository
public interface ImagenProductoRepository extends JpaRepository<ImagenProducto, Integer> {

    List<ImagenProducto> findByProducto_Id(Integer productoId);
    @Query(value = "SELECT ip.url_img FROM imagen_producto ip WHERE ip.id_producto = :productoId ORDER BY ip.orden ASC LIMIT 1", nativeQuery = true)
    String getPrimeraImagen(Integer productoId);
    Page<ImagenProducto> findByProducto_Id(Integer productoId, Pageable pageable);
    List<ImagenProducto> findByProducto_IdOrderByOrdenAsc(Integer productoId);
    Optional<ImagenProducto> findTopByProducto_IdOrderByOrdenAsc(Integer productoId);
    Optional<ImagenProducto> findByProducto_IdAndOrden(Integer productoId, Integer orden);
    boolean existsByProducto_IdAndOrden(Integer productoId, Integer orden);
    void deleteByProducto_Id(Integer productoId);
    List<ImagenProducto> findByUrlImgContainingIgnoreCase(String fragment);
    Optional<ImagenProducto> findByProductoIdAndOrden(Integer productoId, Integer orden);

}
