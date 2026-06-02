package org.swapcloset.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.modelos.Favorito;
import org.swapcloset.backend.modelos.FavoritoId;
import org.swapcloset.backend.modelos.Producto;

import java.util.List;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {

    List<Favorito> findByUsuario_Id(Integer usuarioId);

    List<Favorito> findByProducto_Id(Integer productoId);

    boolean existsByUsuario_IdAndProducto_Id(Integer usuarioId, Integer productoId);

    void deleteByUsuario_IdAndProducto_Id(Integer usuarioId, Integer productoId);

    @Query("SELECT COUNT(f.producto.id) FROM Favorito f WHERE f.usuario.id = :idUsuario")
    Double findCountFavoritosByUsuarioId(@Param("idUsuario") Integer idUsuario);
}
