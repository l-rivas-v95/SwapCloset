package org.swapcloset.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.dto.CartaProductoIntercambioDTO;
import org.swapcloset.backend.modelos.Producto;
import org.swapcloset.backend.modelos.TipoProducto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByUsuarioId(Integer usuarioId);

    @Query("SELECT p FROM Producto p WHERE p.id = :idProducto")
    Producto getProductoById(Integer idProducto);

    @Query("SELECT p FROM Producto p JOIN Favorito f ON f.producto = p WHERE f.usuario.id = :usuarioId")
    List<Producto> findProductosFavoritosByUsuarioId(@Param("usuarioId") Integer usuarioId);

    List<Producto> findByCategoriaAndTallaAndEstado(String categoria, String talla, String estado);

    @Query("SELECT p FROM Producto p WHERE p.usuario.id = :idUsuario AND p.activo = true")
    List<Producto> findAllByUsuarioAndActivo(Integer idUsuario);

    Integer countByUsuarioId(Integer usuarioId);

    Page<Producto> findByActivoTrue(Pageable pageable);

    Optional<Producto> findByIdAndActivoTrue(Integer id);

    List<Producto> findByFechaDevolucionIsNull();

    List<Producto> findByFechaDevolucionBefore(LocalDateTime fecha);

    List<Producto> findByFechaCreacionAfter(LocalDateTime desde);

    List<Producto> findByActivoTrueOrderByIdDesc();

    List<Producto> findByCategoria(String categoria);

    List<Producto> findByMarca(String marca);

    List<Producto> findByTalla(String talla);

    List<Producto> findByTipo(TipoProducto tipo);

    List<Producto> findByPrecioBetween(BigDecimal min, BigDecimal max);

    List<Producto> findByTituloContainingIgnoreCase(String titulo);

    List<Producto> findByColor(String color);

    List<Producto> findByActivoTrue();

    List<Producto> findByCategoriaAndTallaAndActivoTrue(String categoria, String talla);

    List<Producto> findByCategoriaAndEstadoAndActivoTrue(String categoria, String estado);

    List<Producto> findByTallaAndEstadoAndActivoTrue(String talla, String estado);

    List<Producto> findByCategoriaAndTallaAndEstadoAndActivoTrue(String categoria, String talla, String estado);

    List<Producto> findByCategoriaAndActivoTrue(String categoria);

    List<Producto> findByTallaAndActivoTrue(String talla);

    List<Producto> findByEstadoAndActivoTrue(String estado);

    @Query("""
            select new org.swapcloset.backend.dto.CartaProductoIntercambioDTO(
              p.id, p.tipo, p.precio, p.titulo, p.estilo, p.descripcion, p.marca, p.estado,
              p.categoria, p.talla, p.color, p.fechaDevolucion, p.fechaCreacion,
              p.usuario.id, p.activo,
              count(c)
            )
            from Producto p
            join Chat c on c.producto1.id = p.id
            where c.completado = true
            group by
              p.id, p.tipo, p.precio, p.titulo, p.estilo, p.descripcion, p.marca, p.estado,
              p.categoria, p.talla, p.color, p.fechaDevolucion, p.fechaCreacion, p.usuario.id, p.activo
            having count(c) > 0
            order by count(c) desc
            """)
    List<CartaProductoIntercambioDTO> topProductosConMasIntercambios(Pageable pageable);


}

