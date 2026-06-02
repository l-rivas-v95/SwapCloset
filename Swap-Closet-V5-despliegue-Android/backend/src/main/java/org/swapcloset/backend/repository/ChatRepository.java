package org.swapcloset.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.modelos.Chat;
import org.swapcloset.backend.modelos.Usuario;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {

    @Query("select c from Chat c where c.usuario1 = :usuario or c.usuario2 = :usuario")
    List<Chat> findAllByUsuario(@Param("usuario") Usuario usuario);

    @Query("SELECT COUNT(c) FROM Chat c WHERE (c.usuario1.id = :userId OR c.usuario2.id = :userId) AND c.completado = true AND c.producto2 IS NOT NULL")
    Integer getCantidadIntercambios(@Param("userId") Integer userId);

    @Query("SELECT COUNT(c) FROM Chat c WHERE (c.usuario1.id = :userId OR c.usuario2.id = :userId) AND c.completado = true AND c.producto2 IS NULL")
    Integer getCantidadPrestamos(@Param("userId") Integer userId);

    @Query("SELECT COUNT(c) FROM Chat c WHERE (c.usuario1.id = :userId OR c.usuario2.id = :userId) AND c.completado = true")
    Integer getCantidadTotalIntercambiosIdUsuario(@Param("userId") Integer userId);

    @Query("SELECT COUNT(c) FROM Chat c WHERE (c.producto1.id = :prodId OR c.producto2.id = :prodId) AND c.completado = true")
    Integer getCantidadTotalIntercambiosIdProducto(@Param("prodId") Integer prodId);


}
