package org.swapcloset.backend.serviceUnitary;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.dto.ChatDTO;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.service.ChatService;
import org.swapcloset.backend.service.ProductoService;
import org.swapcloset.backend.service.UsuarioService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ChatServiceTest {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProductoService productoService;

    @BeforeAll
    void setup() {
        //USUSARIO1
        UsuarioDTO usuario1 = new UsuarioDTO();
        usuario1.setNombre("Usuario");
        usuario1.setApellidos("De Prueba");
        usuario1.setEmail("prueba@gmail.com");
        usuario1.setPassword("1234");
        usuario1.setDescripcion("Soy un usuario de prueba");

        usuarioService.create(usuario1);

        //USUARIO2
        UsuarioDTO usuarioRaiting = new UsuarioDTO();
        usuarioRaiting.setNombre("UsuarioEstadisticas");
        usuarioRaiting.setApellidos("De Prueba");
        usuarioRaiting.setEmail("raiting@gmail.com");
        usuarioRaiting.setPassword("1234");

        usuarioService.create(usuarioRaiting);

        //PRODUCTO
        ProductoDTO producto1 = new ProductoDTO();
        producto1.setIdUsuario(2);
        producto1.setTitulo("Producto de Prueba");
        producto1.setTipo("Intercambio");
        producto1.setDescripcion("Descripción del producto de prueba");
        producto1.setEstilo("Bohemio");
        producto1.setMarca("MarcaX");
        producto1.setEstado("EstadoX");
        producto1.setCategoria("CategoriaX");
        producto1.setTalla("M");
        producto1.setColor("ColorX");
        producto1.setFechaDevolucion("2025-11-25T07:35:11");
        producto1.setActivo(true);

        productoService.save(producto1);

        ProductoDTO producto2 = new ProductoDTO();
        producto2.setIdUsuario(2);
        producto2.setTitulo("Producto Préstamo");
        producto2.setTipo("Préstamo");
        producto2.setPrecio("10.50");
        producto2.setDescripcion("Descripción del producto de prueba");
        producto2.setEstilo("Casual");
        producto2.setMarca("Nike");
        producto2.setEstado("Bueno");
        producto2.setCategoria("CategoriaX");
        producto2.setTalla("M");
        producto2.setColor("ColorX");
        producto2.setFechaDevolucion("2025-11-25T07:35:11");
        producto2.setActivo(true);

        productoService.save(producto2);

    }

    @Test
    @DisplayName("CASO POSITIVO 6 - CREAR CHAT INTERCAMBIO")
    void crearChatIntercambio(){

        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setProducto2Id(null);
        chat.setActivo(false);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2026-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(true);
        chat.setEstadoIntercambio("devuelto");

        ChatDTO creado = chatService.save(chat);
        Optional<ChatDTO> buscado = chatService.findById(creado.getId());

        assertTrue(buscado.isPresent());
        assertEquals(buscado.get().getUsuario1Id(), creado.getUsuario1Id());
        assertEquals(buscado.get().getUsuario2Id(), creado.getUsuario2Id());
        assertEquals(buscado.get().getProducto1Id(), creado.getProducto1Id());
        assertEquals(buscado.get().getProducto2Id(), creado.getProducto2Id());
        assertEquals(buscado.get().getActivo(), creado.getActivo());
        assertEquals(buscado.get().getFechaQuedada(), creado.getFechaQuedada());
        assertEquals(buscado.get().getFechaDevolucion(), creado.getFechaDevolucion());
        assertEquals(buscado.get().getUbicacion(), creado.getUbicacion());
        assertEquals(buscado.get().getCompletado(), creado.getCompletado());
        assertEquals(buscado.get().getEstadoIntercambio(), creado.getEstadoIntercambio());

    }

    @Test
    @DisplayName("CASO POSITIVO 6 - CREAR CHAT PRÉSTAMO")
    void crearChatPrestamo(){

        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setProducto2Id(2);
        chat.setActivo(true);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2027-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(false);
        chat.setEstadoIntercambio("pendiente");

        ChatDTO creado = chatService.save(chat);
        Optional<ChatDTO> buscado = chatService.findById(creado.getId());

        assertTrue(buscado.isPresent());
        assertEquals(buscado.get().getUsuario1Id(), creado.getUsuario1Id());
        assertEquals(buscado.get().getUsuario2Id(), creado.getUsuario2Id());
        assertEquals(buscado.get().getProducto1Id(), creado.getProducto1Id());
        assertEquals(buscado.get().getProducto2Id(), creado.getProducto2Id());
        assertEquals(buscado.get().getActivo(), creado.getActivo());
        assertEquals(buscado.get().getFechaQuedada(), creado.getFechaQuedada());
        assertEquals(buscado.get().getFechaDevolucion(), creado.getFechaDevolucion());
        assertEquals(buscado.get().getUbicacion(), creado.getUbicacion());
        assertEquals(buscado.get().getCompletado(), creado.getCompletado());
        assertEquals(buscado.get().getEstadoIntercambio(), creado.getEstadoIntercambio());

    }

    @Test
    @DisplayName("CASO NEGATIVO 6 - TIPO DE ESTADO INVÁLIDO")
    void crearChatTipoEstadoInvalido(){

        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setProducto2Id(2);
        chat.setActivo(true);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2027-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(false);
        chat.setEstadoIntercambio("estado_invalido");

        assertThrows(ResponseStatusException.class, () -> {
            chatService.save(chat);
        });

    }

    @Test
    @DisplayName("CASO NEGATIVO 6 - USUARIO 2 NO EXISTE")
    void crearChatUsuario2NoExiste(){

        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(999);
        chat.setProducto1Id(1);
        chat.setProducto2Id(2);
        chat.setActivo(true);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2027-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(false);
        chat.setEstadoIntercambio("pendiente");

        assertThrows(ResponseStatusException.class, () -> {
            chatService.save(chat);
        });

    }

    // TESTS 7 - ACTUALIZAR CHAT

    @Test
    @DisplayName("CASO POSITIVO 7 - CAMBIO DE ESTADO A ACEPTADO")
    void actualizarChatCambioEstadoAceptado(){
        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setProducto2Id(null);
        chat.setActivo(false);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2026-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(true);
        chat.setEstadoIntercambio("pendiente");

        ChatDTO creado = chatService.save(chat);

        creado.setEstadoIntercambio("aceptado");
        ChatDTO actualizado = chatService.update(creado);

        assertEquals("aceptado", actualizado.getEstadoIntercambio());
    }

    @Test
    @DisplayName("CASO POSITIVO 7 - CAMBIO DE ESTADO A DEVUELTO")
    void actualizarChatCambioEstadoDevuelto(){
        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setProducto2Id(2);
        chat.setActivo(true);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2026-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(false);
        chat.setEstadoIntercambio("aceptado");

        ChatDTO creado = chatService.save(chat);

        creado.setEstadoIntercambio("devuelto");
        ChatDTO actualizado = chatService.update(creado);

        assertEquals("devuelto", actualizado.getEstadoIntercambio());
    }

    @Test
    @DisplayName("CASO NEGATIVO 7 - ID CHAT INEXISTENTE")
    void actualizarChatIdInexistente(){
        ChatDTO chat = new ChatDTO();
        chat.setId(999);
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setProducto2Id(2);
        chat.setActivo(true);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2026-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(false);
        chat.setEstadoIntercambio("aceptado");

        assertThrows(ResponseStatusException.class, () -> {
            chatService.update(chat);
        });
    }

    @Test
    @DisplayName("CASO NEGATIVO 7 - FORMATO DE FECHA INVÁLIDO")
    void actualizarChatFormatoFechaInvalido(){
        ChatDTO chat = new ChatDTO();
        chat.setUsuario1Id(1);
        chat.setUsuario2Id(2);
        chat.setProducto1Id(1);
        chat.setProducto2Id(2);
        chat.setActivo(true);
        chat.setFechaQuedada("2026-10-27T14:00:00");
        chat.setFechaDevolucion("2026-12-04T14:00:00");
        chat.setUbicacion("Jaen");
        chat.setCompletado(false);
        chat.setEstadoIntercambio("aceptado");

        ChatDTO creado = chatService.save(chat);

        creado.setFechaDevolucion("04-12-2026 14:00:00"); // Formato inválido

        assertThrows(ResponseStatusException.class, () -> {
            chatService.update(creado);
        });
    }

}
