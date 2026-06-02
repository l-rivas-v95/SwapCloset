package org.swapcloset.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.modelos.*;

import java.util.List;

@Repository
public interface SeguidorRepository extends JpaRepository<Seguidor, SeguidoresId> {

    @Query("SELECT COUNT(s.seguidor.id) FROM Seguidor s WHERE s.seguido.id = :idUsuario")
    Double getTotalSeguidores(@Param("idUsuario") Integer idUsuario);

    @Query("SELECT s.seguido FROM Seguidor s WHERE s.seguidor.id = :idUsuario")
    List<Usuario> findSeguidosByUsuarioId(@Param("idUsuario") Integer idUsuario);
    @Query("SELECT s.seguidor FROM Seguidor s WHERE s.seguido.id = :idUsuario")
    List<Usuario> findSeguidoresByUsuarioId(@Param("idUsuario") Integer idUsuario);
    @Modifying
    @Transactional
    Integer deleteBySeguidorIdAndSeguidoId(Integer idSeguidor, Integer idSeguido);

    boolean existsBySeguidorIdAndSeguidoId(Integer seguidorId, Integer seguidoId);
}
