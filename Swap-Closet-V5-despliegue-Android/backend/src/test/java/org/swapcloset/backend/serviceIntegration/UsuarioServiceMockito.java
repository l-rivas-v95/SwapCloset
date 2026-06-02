package org.swapcloset.backend.serviceIntegration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.swapcloset.backend.converter.UsuarioMapper;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.dto.UsuarioEstadisticaDTO;
import org.swapcloset.backend.dto.UsuarioEstadisticaProductosDTO;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.ProductoRepository;
import org.swapcloset.backend.repository.UsuarioRepository;
import org.swapcloset.backend.service.ChatService;
import org.swapcloset.backend.service.ProductoService;
import org.swapcloset.backend.service.RaitingService;
import org.swapcloset.backend.service.SeguidorService;
import org.swapcloset.backend.service.UsuarioService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceMockito {
    @Spy
    @InjectMocks
    private UsuarioService service;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioMapper mapper;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private RaitingService raitingService;

    @Mock
    private ChatService chatService;

    @Mock
    private SeguidorService seguidorService;

    @Mock
    private ProductoService productoService;

    @Test
    @DisplayName("TEST INTEGRACIÓN 1 - GUARDAR USUARIO")
    void guardarUsuarioMockito() {

        // GIVEN
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setEmail("integracion@gmail.com");

        Usuario entidad = new Usuario();
        Usuario saved = new Usuario();
        UsuarioDTO savedDTO = new UsuarioDTO();

        Mockito.when(usuarioRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.empty());
        Mockito.when(mapper.toEntity(Mockito.any(UsuarioDTO.class))).thenReturn(entidad);
        Mockito.when(usuarioRepository.save(Mockito.any(Usuario.class))).thenReturn(saved);
        Mockito.when(mapper.toDTO(Mockito.any(Usuario.class))).thenReturn(savedDTO);

        // THEN
        UsuarioDTO res = service.create(usuarioDTO);

        // WHEN
        assertNotNull(res);
        assertNull(usuarioDTO.getId(), "El método debe forzar id=null antes de guardar");

        Mockito.verify(usuarioRepository).findByEmail(Mockito.anyString());
        Mockito.verify(mapper).toEntity(Mockito.any(UsuarioDTO.class));
        Mockito.verify(usuarioRepository).save(Mockito.any(Usuario.class));
        Mockito.verify(mapper).toDTO(Mockito.any(Usuario.class));
    }

    @Test
    @DisplayName("TEST INTEGRACIÓN 2 - OBETENR USUSARIO, ESTADÍSTICAS Y PRODUCTOS")
    void obtenerUsuarioEstadisticasYproductosMockito() {

        // GIVEN
        Integer idUsuario = 1;

        Usuario usuario = new Usuario();
        usuario.setId(idUsuario);
        usuario.setEmail("integracion@gmail.com");

        Mockito.when(usuarioRepository.findById(Mockito.eq(idUsuario))).thenReturn(Optional.of(usuario));

        // 4.26 -> 4.5
        Mockito.when(raitingService.obtenerMediaPuntuacionUsuario(Mockito.eq(idUsuario))).thenReturn(4.26);

        // countByUsuarioId debe devolver Integer
        Mockito.when(productoRepository.countByUsuarioId(Mockito.eq(idUsuario))).thenReturn(12);

        Mockito.when(chatService.getCantidadTotalIntercambios(Mockito.eq(idUsuario))).thenReturn(3);

        Mockito.when(seguidorService.getTotalSeguidores(Mockito.eq(idUsuario))).thenReturn(99);

        List<ProductoDTO> productosMock = List.of();
        Mockito.when(productoService.getProductosPorUsuarioId(Mockito.eq(idUsuario))).thenReturn(productosMock);

        // THEN
        UsuarioEstadisticaProductosDTO res = service.obtenerUsuarioEstadisticasYproductos(idUsuario);


        // VERIFY
        Mockito.verify(usuarioRepository).findById(Mockito.eq(idUsuario));
        Mockito.verify(raitingService).obtenerMediaPuntuacionUsuario(Mockito.eq(idUsuario));
        Mockito.verify(productoRepository).countByUsuarioId(Mockito.eq(idUsuario));
        Mockito.verify(chatService).getCantidadTotalIntercambios(Mockito.eq(idUsuario));
        Mockito.verify(seguidorService).getTotalSeguidores(Mockito.eq(idUsuario));
        Mockito.verify(productoService).getProductosPorUsuarioId(Mockito.eq(idUsuario));
    }

    @Test
    @DisplayName("TEST INTEGRACIÓN 10 - OBTENER USUSARIO CON MÁS INTERCAMBIOS")
    void obtenerUsuarioConMasIntercambiosMockito() {

        // GIVEN
        Integer idTop = 2;

        UsuarioEstadisticaDTO dtoTop = new UsuarioEstadisticaDTO();
        dtoTop.setId(idTop);
        dtoTop.setIntercambios(10);

        Mockito.when(usuarioRepository.findTopUsuarioIdConMasIntercambios(PageRequest.of(0, 1)))
                .thenReturn(List.of(idTop));

        // Stub del metodo interno del service
        Mockito.doReturn(dtoTop)
                .when(service)
                .obtenerUsuarioEstadisticas(idTop);

        // WHEN
        Optional<UsuarioEstadisticaDTO> res = service.obtenerUsuarioConMasIntercambios();

        // THEN
        assertTrue(res.isPresent());
        assertEquals(idTop, res.get().getId());
        assertEquals(10, res.get().getIntercambios());

        // VERIFY
        Mockito.verify(usuarioRepository).findTopUsuarioIdConMasIntercambios(PageRequest.of(0, 1));
        Mockito.verify(service).obtenerUsuarioEstadisticas(idTop);
        Mockito.verifyNoMoreInteractions(usuarioRepository);
    }
}
