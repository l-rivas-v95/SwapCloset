package org.swapcloset.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.modelos.Raiting;
import org.swapcloset.backend.modelos.RaitingId;

import java.util.List;
import java.util.Optional;
@Repository
public interface RaitingRepository extends JpaRepository<Raiting, RaitingId> {
    List<Raiting> findByPuntuado_Id(Integer idPuntuado);
    List<Raiting> findByPuntuador_Id(Integer idPuntuador);
    @Query("SELECT AVG(r.puntuacion) FROM Raiting r WHERE r.puntuado.id = :idUsuario")
    Double findAveragePuntuacionByPuntuadoId(@Param("idUsuario") Integer idUsuario);
    Optional<Raiting> findByPuntuado_IdAndPuntuador_Id(Integer idPuntuado, Integer idPuntuador);
    boolean existsByPuntuado_IdAndPuntuador_Id(Integer idPuntuado, Integer idPuntuador);
    long countByPuntuado_Id(Integer idPuntuado);
    void deleteByPuntuado_Id(Integer idPuntuado);
    void deleteByPuntuador_Id(Integer idPuntuador);
    List<Raiting> findTop5ByPuntuado_IdOrderByPuntuacionDesc(Integer idPuntuado);

}