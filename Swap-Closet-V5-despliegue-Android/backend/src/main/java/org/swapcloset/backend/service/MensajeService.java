package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swapcloset.backend.converter.MensajeMapper;
import org.swapcloset.backend.dto.MensajeDTO;
import org.swapcloset.backend.modelos.Chat;
import org.swapcloset.backend.modelos.Mensaje;
import org.swapcloset.backend.repository.MensajeRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MensajeService {

    private final MensajeRepository mensajeRepository;
    private final MensajeMapper mensajeMapper;

    @PersistenceContext
    private final EntityManager em;


    @Transactional(readOnly = true)
    public List<MensajeDTO> findAll() {
        return mensajeRepository.findAll().stream()
                .map(mensajeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<MensajeDTO> findById(Integer id) {
        return mensajeRepository.findById(id).map(mensajeMapper::toDTO);
    }

    @Transactional
    public MensajeDTO save(MensajeDTO dto) {
        if (dto == null) throw new IllegalArgumentException("MensajeDTO no debe ser null");
        if (dto.getIdChat() == null) throw new IllegalArgumentException("idChat es obligatorio");
        if (dto.getContenido() == null || dto.getContenido().isBlank())
            throw new IllegalArgumentException("Contenido es obligatorio");

        Mensaje entity = mensajeMapper.toEntity(dto);
        Chat chatRef = em.getReference(Chat.class, dto.getIdChat());
        entity.setChat(chatRef);

        if (entity.getFechaEnvio() == null) {
            entity.setFechaEnvio(LocalDateTime.now());
        }
        if (entity.getLeido() == null) {
            entity.setLeido(false);
        }

        Mensaje saved = mensajeRepository.save(entity);
        return mensajeMapper.toDTO(saved);
    }

    @Transactional
    public MensajeDTO update(MensajeDTO dto) {
        if (dto == null || dto.getId() == null)
            throw new IllegalArgumentException("MensajeDTO y su id no deben ser null");

        Mensaje existente = mensajeRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("No existe Mensaje con id: " + dto.getId()));

        if (dto.getContenido() != null) existente.setContenido(dto.getContenido());
        if (dto.getFechaEnvio() != null) existente.setFechaEnvio(LocalDateTime.parse(dto.getFechaEnvio()));
        if (dto.getLeido() != null) existente.setLeido(dto.getLeido());

        if (dto.getIdChat() != null) {
            existente.setChat(em.getReference(Chat.class, dto.getIdChat()));
        }

        Mensaje updated = mensajeRepository.save(existente);
        return mensajeMapper.toDTO(updated);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (id == null) return;
        mensajeRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return id != null && mensajeRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public List<MensajeDTO> findByChatId(Integer chatId) {
        if (chatId == null) return List.of();
        return mensajeRepository.findByChat_IdOrderByFechaEnvioAsc(chatId).stream()
                .map(mensajeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<MensajeDTO> findByChatIdPaged(Integer chatId, Pageable pageable) {
        if (chatId == null) return Page.empty();
        Page<Mensaje> page = mensajeRepository.findByChat_IdOrderByFechaEnvioDesc(chatId, pageable);
        List<MensajeDTO> dtos = page.getContent().stream()
                .map(mensajeMapper::toDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Optional<MensajeDTO> findLastByChatId(Integer chatId) {
        if (chatId == null) return Optional.empty();
        return mensajeRepository.findTopByChat_IdOrderByFechaEnvioDesc(chatId)
                .map(mensajeMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<MensajeDTO> searchByTexto(String texto) {
        if (texto == null || texto.isBlank()) return List.of();
        return mensajeRepository.findByContenidoContainingIgnoreCase(texto).stream()
                .map(mensajeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MensajeDTO> findLeidos() {
        return mensajeRepository.findAll().stream()
                .filter(m -> Boolean.TRUE.equals(m.getLeido()))
                .map(mensajeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MensajeDTO> findNoLeidosByChatId(Integer chatId) {
        if (chatId == null) return List.of();
        Chat chatRef = em.getReference(Chat.class, chatId);
        return mensajeRepository.findByChatAndLeidoFalse(chatRef).stream()
                .map(mensajeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countNoLeidosByChatId(Integer chatId) {
        if (chatId == null) return 0L;
        return mensajeRepository.countByChat_IdAndLeidoFalse(chatId);
    }

    @Transactional
    public void deleteByChatId(Integer chatId) {
        if (chatId == null) return;
        mensajeRepository.deleteByChat_Id(chatId);
    }
}