package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.converter.ChatMapper;
import org.swapcloset.backend.dto.ChatDTO;
import org.swapcloset.backend.modelos.Chat;
import org.swapcloset.backend.modelos.Producto;
import org.swapcloset.backend.modelos.TipoEstadoIntercambio;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.ChatRepository;
import org.swapcloset.backend.repository.ProductoRepository;
import org.swapcloset.backend.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMapper chatMapper;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    @PersistenceContext
    private EntityManager em;


    @Transactional(readOnly = true)
    public List<ChatDTO> findAll() {
        return chatRepository.findAll().stream()
                .map(chatMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Integer getCantidadIntercambios(Integer id) {
        return chatRepository.getCantidadIntercambios(id);
    }

    @Transactional
    public Integer getCantidadPrestamos(Integer id) {
        return chatRepository.getCantidadPrestamos(id);
    }

    @Transactional
    public Integer getCantidadTotalIntercambios(Integer id) {
        return chatRepository.getCantidadTotalIntercambiosIdUsuario(id);
    }

    @Transactional
    public Integer getCantidadTotalIntercambiosPorProducto(Integer id) {
        return chatRepository.getCantidadTotalIntercambiosIdProducto(id);
    }

    @Transactional(readOnly = true)
    public Optional<ChatDTO> findById(Integer id) {
        return chatRepository.findById(id).map(chatMapper::toDTO);
    }

    @Transactional
    public ChatDTO save(ChatDTO dto) {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ChatDTO no debe ser null");
        }
        if (dto.getUsuario1Id() == null || dto.getUsuario2Id() == null || dto.getProducto1Id() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "usuario1Id, usuario2Id y producto1Id son obligatorios al crear un chat");
        }

        if (!usuarioRepository.existsById(dto.getUsuario1Id())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario 1 no encontrado con ID: " + dto.getUsuario1Id());
        }
        if (!usuarioRepository.existsById(dto.getUsuario2Id())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario 2 no encontrado con ID: " + dto.getUsuario2Id());
        }
        if (!productoRepository.existsById(dto.getProducto1Id())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto 1 no encontrado con ID: " + dto.getProducto1Id());
        }
        if (dto.getProducto2Id() != null && !productoRepository.existsById(dto.getProducto2Id())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto 2 no encontrado con ID: " + dto.getProducto2Id());
        }
        if(!dto.getEstadoIntercambio().equalsIgnoreCase("pendiente") & !dto.getEstadoIntercambio().equalsIgnoreCase("aceptado") & !dto.getEstadoIntercambio().equalsIgnoreCase("devuelto")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El estado de intercambio debe ser: pendiente, aceptado o devuelto");
        }

        Chat entity = chatMapper.toEntity(dto);

        Usuario u1 = em.getReference(Usuario.class, dto.getUsuario1Id());
        Usuario u2 = em.getReference(Usuario.class, dto.getUsuario2Id());
        Producto p1 = em.getReference(Producto.class, dto.getProducto1Id());

        entity.setUsuario1(u1);
        entity.setUsuario2(u2);
        entity.setProducto1(p1);

        if (dto.getProducto2Id() != null) {
            Producto p2 = em.getReference(Producto.class, dto.getProducto2Id());
            entity.setProducto2(p2);
        }

        Chat saved = chatRepository.save(entity);
        return chatMapper.toDTO(saved);
    }


    @Transactional
    public ChatDTO update(ChatDTO dto) {

        if (dto == null || dto.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ChatDTO y su id no deben ser null");
        }

        Chat existente = chatRepository.findById(dto.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No existe Chat con id: " + dto.getId()));


        try {
            if (dto.getFechaQuedada() != null)
                existente.setFechaQuedada(LocalDateTime.parse(dto.getFechaQuedada()));

            if (dto.getFechaDevolucion() != null)
                existente.setFechaDevolucion(LocalDateTime.parse(dto.getFechaDevolucion()));
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Formato de fecha inválido. Asegúrate de usar el formato yyyy-MM-dd'T'HH:mm:ss.");
        }

        if (dto.getActivo() != null)
            existente.setActivo(dto.getActivo());

        if (dto.getUbicacion() != null)
            existente.setUbicacion(dto.getUbicacion());

        if (dto.getCompletado() != null)
            existente.setCompletado(dto.getCompletado());

        if (dto.getEstadoIntercambio() != null) {
            String estado = dto.getEstadoIntercambio().toLowerCase();

            try {
                TipoEstadoIntercambio tipo = TipoEstadoIntercambio.valueOf(estado);
                existente.setEstadoIntercambio(tipo);
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Estado de intercambio inválido. Valores permitidos: pendiente, aceptado, devuelto");
            }
        }


        if (dto.getUsuario1Id() != null) {
            if (!usuarioRepository.existsById(dto.getUsuario1Id())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Usuario 1 no encontrado con ID: " + dto.getUsuario1Id());
            }
            existente.setUsuario1(em.getReference(Usuario.class, dto.getUsuario1Id()));
        }

        if (dto.getUsuario2Id() != null) {
            if (!usuarioRepository.existsById(dto.getUsuario2Id())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Usuario 2 no encontrado con ID: " + dto.getUsuario2Id());
            }
            existente.setUsuario2(em.getReference(Usuario.class, dto.getUsuario2Id()));
        }

        if (dto.getProducto1Id() != null) {
            if (!productoRepository.existsById(dto.getProducto1Id())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto 1 no encontrado con ID: " + dto.getProducto1Id());
            }
            existente.setProducto1(em.getReference(Producto.class, dto.getProducto1Id()));
        }

        if (dto.getProducto2Id() != null) {
            if (!productoRepository.existsById(dto.getProducto2Id())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Producto 2 no encontrado con ID: " + dto.getProducto2Id());
            }
            existente.setProducto2(em.getReference(Producto.class, dto.getProducto2Id()));
        }

        Chat updated = chatRepository.save(existente);

        Chat fullyLoadedChat = chatRepository.findById(updated.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Fallo al recargar el chat actualizado."));

        return chatMapper.toDTO(fullyLoadedChat);

    }

    @Transactional
    public void deleteById(Integer id) {
        if (id == null || !chatRepository.existsById(id)) return;
        chatRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return id != null && chatRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public List<Chat> getAllChatByUsuario(Usuario usuario) {
        // usa el método existente en el repository
        return chatRepository.findAllByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public List<ChatDTO> getAllChatByUsuarioDTO(Usuario usuario) {
        return getAllChatByUsuario(usuario).stream()
                .map(chatMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatDTO> findByUsuarioId(Integer usuarioId) {
        if (usuarioId == null) return List.of();
        Usuario uRef = em.getReference(Usuario.class, usuarioId);
        return getAllChatByUsuario(uRef).stream()
                .map(chatMapper::toDTO)
                .collect(Collectors.toList());
    }
}