package org.swapcloset.backend.serviceIntegration;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.converter.ChatMapper;
import org.swapcloset.backend.dto.ChatDTO;


import org.swapcloset.backend.repository.ChatRepository;
import org.swapcloset.backend.repository.ProductoRepository;
import org.swapcloset.backend.repository.UsuarioRepository;
import org.swapcloset.backend.service.ChatService;

import org.mockito.InjectMocks;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class ChatServiceMockito {

    @InjectMocks
    private ChatService chatService;
    @Mock
    private ChatRepository chatRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private ProductoRepository productoRepository;
    @Mock
    private ChatMapper chatMapper;
    @Mock
    private EntityManager em;

    @Test
    @DisplayName("TEST INTEGRACIÓN 6 - CREAR INTERCAMBIO TIPO INVÁLIDO")
    void crearIntercambioTipoInvalidoMockito() {
        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setEstadoIntercambio("ERROR");

        Mockito.when(usuarioRepository.existsById(1)).thenReturn(true);
        Mockito.when(usuarioRepository.existsById(2)).thenReturn(true);
        Mockito.when(productoRepository.existsById(1)).thenReturn(true);

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> chatService.save(chat)
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertEquals("El estado de intercambio debe ser: pendiente, aceptado o devuelto", ex.getReason());

        Mockito.verifyNoInteractions(chatRepository, chatMapper, em);

    }


    @Test
    @DisplayName("TEST INTEGRACIÓN 7 - ACTUALIZAR CHAT ID INEXISTENTE")
    void actualizarChatIdInexistenteMockito() {

        ChatDTO chat = new ChatDTO();
        chat.setId(9999); // ID inexistente


        Mockito.when(chatRepository.findById(9999)).thenReturn(Optional.empty());

        // THEN
        Exception exception = assertThrows(ResponseStatusException.class, () -> {
            chatService.update(chat);
        });

        assertEquals(HttpStatus.NOT_FOUND, ((ResponseStatusException) exception).getStatusCode());
        assertEquals("No existe Chat con id: 9999", ((ResponseStatusException) exception).getReason());

        Mockito.verify(chatRepository).findById(9999);

    }
}
