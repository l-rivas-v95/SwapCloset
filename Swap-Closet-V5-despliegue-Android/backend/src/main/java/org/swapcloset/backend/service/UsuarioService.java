package org.swapcloset.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.converter.UsuarioMapper;
import org.swapcloset.backend.dto.CartaUsuarioDTO;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.dto.UsuarioEstadisticaDTO;
import org.swapcloset.backend.dto.UsuarioEstadisticaProductosDTO;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.ProductoRepository;
import org.swapcloset.backend.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final RaitingService raitingService;
    private final ProductoRepository productoRepository;
    private final ChatService chatService;
    private final SeguidorService seguidorService;
    private final ProductoService productoService;
    private final FavoritoService favoritoService;

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioEstadisticaDTO obtenerUsuarioEstadisticas(Integer idUsuario) {
        if (idUsuario == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del usuario no puede ser null");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La ID del usuario no existe"));

        UsuarioEstadisticaDTO dto = new UsuarioEstadisticaDTO();

        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos());
        dto.setEmail(usuario.getEmail());
        dto.setDescripcion(usuario.getDescripcion());
        dto.setEstilo(usuario.getEstilo());
        dto.setUrlImg(usuario.getUrlImg());
        dto.setDireccion(usuario.getDireccion());
        dto.setTCamiseta(usuario.getTCamiseta());
        dto.setTPantalon(usuario.getTPantalon());
        dto.setTCalzado(usuario.getTCalzado());

        Double media = raitingService.obtenerMediaPuntuacionUsuario(usuario.getId());
        if (media != null) {
            media = Math.round(media * 2) / 2.0;
        }
        dto.setRaiting(media);
        dto.setPublicaciones(productoRepository.countByUsuarioId(usuario.getId()));
        dto.setIntercambios(chatService.getCantidadTotalIntercambios(usuario.getId()));
        dto.setSeguidores(seguidorService.getTotalSeguidores(usuario.getId()));
        dto.setFavoritos(favoritoService.findCountFavoritosByUsuarioId(usuario.getId()));

        return dto;
    }

    @Transactional(readOnly = true)
    public UsuarioEstadisticaProductosDTO obtenerUsuarioEstadisticasYproductos(Integer idUsuario) {
        if (idUsuario == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del usuario no puede ser null");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La ID del usuario no existe"));

        UsuarioEstadisticaProductosDTO dto = new UsuarioEstadisticaProductosDTO();

        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos());
        dto.setEmail(usuario.getEmail());
        dto.setDescripcion(usuario.getDescripcion());
        dto.setEstilo(usuario.getEstilo());
        dto.setUrlImg(usuario.getUrlImg());
        dto.setDireccion(usuario.getDireccion());
        dto.setTCamiseta(usuario.getTCamiseta());
        dto.setTPantalon(usuario.getTPantalon());
        dto.setTCalzado(usuario.getTCalzado());

        Double media = raitingService.obtenerMediaPuntuacionUsuario(usuario.getId());
        if (media != null) {
            media = Math.round(media * 2) / 2.0;
        }
        dto.setRaiting(media);
        dto.setPublicaciones(productoRepository.countByUsuarioId(usuario.getId()));
        dto.setIntercambios(chatService.getCantidadTotalIntercambios(usuario.getId()));
        dto.setSeguidores(seguidorService.getTotalSeguidores(usuario.getId()));
        dto.setProductosPublicados(productoService.getProductosPorUsuarioId(usuario.getId()));

        return dto;
    }

    @Transactional(readOnly = true)
    public List<UsuarioEstadisticaDTO> obtenerTodosUsuariosEstadisticas() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuario -> obtenerUsuarioEstadisticas(usuario.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioEstadisticaDTO> obtenerUsuarioConMasIntercambios() {
        List<Integer> ids = usuarioRepository.findTopUsuarioIdConMasIntercambios(PageRequest.of(0, 1));

        if (ids.isEmpty()) {
            return Optional.empty();
        }

        Integer idTop = ids.get(0);
        return Optional.of(obtenerUsuarioEstadisticas(idTop));
    }

    @Transactional(readOnly = true)
    public Optional<CartaUsuarioDTO> obtenerCartaUsuarioPorId(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .map(usuario -> {
                    CartaUsuarioDTO carta = new CartaUsuarioDTO();
                    carta.setId(usuario.getId());
                    carta.setNombre(usuario.getNombre());
                    carta.setApellidos(usuario.getApellidos());
                    carta.setUrlImg(usuario.getUrlImg());
                    carta.setDireccion(usuario.getDireccion());
                    carta.setRaiting(raitingService.obtenerMediaPuntuacionUsuario(usuario.getId()));
                    carta.setIntercambios(chatService.getCantidadTotalIntercambios(usuario.getId()));
                    return carta;
                });
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> findById(Integer id) {
        return usuarioRepository.findById(id).map(usuarioMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return email != null && usuarioRepository.findByEmail(email).isPresent();
    }

    public Optional<UsuarioDTO> login(String email, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if(usuario.isPresent() && usuario.get().getPassword().equals(password)) {
            return Optional.of(usuarioMapper.toDTO(usuario.get()));
        }
        return Optional.empty();
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> findByEmail(String email) {
        return usuarioRepository.findByEmail(email).map(usuarioMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findByNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre)
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findByDireccionContaining(String direccion) {
        return usuarioRepository.findByDireccionContainingIgnoreCase(direccion)
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> findWithProductsAndChatsById(Integer id) {
        return usuarioRepository.findWithProductsAndChatsById(id)
                .map(usuarioMapper::toDTO);
    }

    @Transactional
    public UsuarioDTO create(UsuarioDTO usuarioDTO) {
        if (usuarioDTO == null) {
            throw new IllegalArgumentException("UsuarioDTO no puede ser null");
        }
        usuarioDTO.setId(null);

        if (usuarioDTO.getEmail() != null && usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        try {
            Usuario entidad = usuarioMapper.toEntity(usuarioDTO);
            Usuario saved = usuarioRepository.save(entidad);
            return usuarioMapper.toDTO(saved);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Faltan campos obligatorios o datos inválidos");
        }
    }

    @Transactional
    public UsuarioDTO update(UsuarioDTO usuarioDTO) {
        if (usuarioDTO == null || usuarioDTO.getId() == null) {
            throw new IllegalArgumentException("UsuarioDTO y su id no deben ser null");
        }

        Usuario entidad = usuarioRepository.findById(usuarioDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + usuarioDTO.getId()));

        usuarioMapper.updateEntityFromDTO(usuarioDTO, entidad);

        if (usuarioDTO.getEmail() != null) {
            usuarioRepository.findByEmail(usuarioDTO.getEmail())
                    .filter(u -> !u.getId().equals(entidad.getId()))
                    .ifPresent(u -> { throw new IllegalArgumentException("Email ya en uso por otro usuario"); });
        }

        Usuario updated = usuarioRepository.save(entidad);
        return usuarioMapper.toDTO(updated);
    }

    @Transactional
    public UsuarioDTO actualizarFotoPerfil(Integer idUsuario, String urlImg) {
        if (idUsuario == null) {
            throw new IllegalArgumentException("El id del usuario no puede ser null");
        }
        if (urlImg == null || urlImg.isBlank()) {
            throw new IllegalArgumentException("La URL de la imagen no puede estar vacía");
        }

        Usuario entidad = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + idUsuario));

        entidad.setUrlImg(urlImg);
        Usuario updated = usuarioRepository.save(entidad);
        return usuarioMapper.toDTO(updated);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (id == null) return;
        usuarioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return id != null && usuarioRepository.existsById(id);
    }
}
