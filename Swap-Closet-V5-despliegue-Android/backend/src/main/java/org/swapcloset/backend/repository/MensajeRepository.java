package org.swapcloset.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.modelos.Chat;
import org.swapcloset.backend.modelos.Mensaje;

import java.util.List;
import java.util.Optional;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {

    List<Mensaje> findByChat_IdOrderByFechaEnvioAsc(Integer chatId);
    Page<Mensaje> findByChat_IdOrderByFechaEnvioDesc(Integer chatId, Pageable pageable);
    Optional<Mensaje> findTopByChat_IdOrderByFechaEnvioDesc(Integer chatId);
    List<Mensaje> findByChatAndLeidoFalse(Chat chat);
    long countByChat_IdAndLeidoFalse(Integer chatId);
    void deleteByChat_Id(Integer chatId);
    List<Mensaje> findByContenidoContainingIgnoreCase(String fragment);
}