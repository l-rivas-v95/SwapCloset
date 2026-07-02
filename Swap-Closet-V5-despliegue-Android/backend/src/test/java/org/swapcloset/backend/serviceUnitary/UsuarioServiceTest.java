package org.swapcloset.backend.serviceUnitary;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.dto.*;
import org.swapcloset.backend.service.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class UsuarioServiceTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RaitingService raitingService;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ChatService chatService;

    @Autowired
    private SeguidorService seguidorService;

    @Autowired
    private FavoritoService favoritoService;

    @BeforeAll
    void cargarDatos() {

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

        UsuarioDTO usuarioSeguidor = new UsuarioDTO();
        usuarioSeguidor.setNombre("UsuarioSeguidor");
        usuarioSeguidor.setApellidos("De Prueba");
        usuarioSeguidor.setEmail("ususu@gmail.com");
        usuarioSeguidor.setPassword("1234");

        usuarioService.create(usuarioSeguidor);

        //RAITING
        RaitingDTO raiting1 = new RaitingDTO();
        raiting1.setIdPuntuador(2);
        raiting1.setIdPuntuado(1);
        raiting1.setPuntuacion(4);

        raitingService.save(raiting1);

        //PRODUCTO
        ProductoDTO producto1 = new ProductoDTO();
        producto1.setIdUsuario(1);
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

        // Segundo producto para usuario 1 (necesario para que el test de estadísticas espere 2)
        ProductoDTO productoUsuario1b = new ProductoDTO();
        productoUsuario1b.setIdUsuario(1);
        productoUsuario1b.setTitulo("Producto de Prueba 2");
        productoUsuario1b.setTipo("Intercambio");
        productoUsuario1b.setDescripcion("Segundo producto del usuario de prueba");
        productoUsuario1b.setEstilo("Casual");
        productoUsuario1b.setMarca("MarcaY");
        productoUsuario1b.setEstado("Bueno");
        productoUsuario1b.setCategoria("CategoriaY");
        productoUsuario1b.setTalla("L");
        productoUsuario1b.setColor("ColorY");
        productoUsuario1b.setFechaDevolucion("2025-11-25T07:35:11");
        productoUsuario1b.setActivo(true);

        productoService.save(productoUsuario1b);

        ProductoDTO productoIntercambio2 = new ProductoDTO();
        productoIntercambio2.setIdUsuario(3);
        productoIntercambio2.setTitulo("Producto de Intercambio");
        productoIntercambio2.setTipo("Intercambio");
        productoIntercambio2.setDescripcion("Producto de Intercambio 2 descripcion");
        productoIntercambio2.setEstilo("Bohemio");
        productoIntercambio2.setMarca("MarcaX");
        productoIntercambio2.setEstado("EstadoX");
        productoIntercambio2.setCategoria("CategoriaX");
        productoIntercambio2.setTalla("M");
        productoIntercambio2.setColor("ColorX");
        productoIntercambio2.setFechaDevolucion("2025-11-25T07:35:11");
        productoIntercambio2.setActivo(true);

        productoService.save(productoIntercambio2);

        ProductoDTO producto4 = new ProductoDTO();
        producto4.setIdUsuario(2);
        producto4.setTitulo("Producto Favorito");
        producto4.setTipo("Intercambio");
        producto4.setDescripcion("Descripción del producto favorito");
        producto4.setEstilo("Bohemio");
        producto4.setMarca("MarcaY");
        producto4.setEstado("EstadoY");
        producto4.setCategoria("CategoriaY");
        producto4.setTalla("L");
        producto4.setColor("ColorY");
        producto4.setFechaDevolucion("2025-12-15T10:00:00");
        producto4.setActivo(true);
        productoService.save(producto4);

        //CHAT
        ChatDTO chat1 = new ChatDTO();
        chat1.setUsuario1Id(1);
        chat1.setUsuario2Id(2);
        chat1.setProducto1Id(1);
        chat1.setProducto2Id(null);
        chat1.setActivo(false);
        chat1.setFechaQuedada("2026-10-27T14:00:00");
        chat1.setFechaDevolucion("2026-12-04T14:00:00");
        chat1.setUbicacion("Jaen");
        chat1.setCompletado(true);
        chat1.setEstadoIntercambio("devuelto");

        chatService.save(chat1);

        ChatDTO chat2 = new ChatDTO();
        chat2.setUsuario1Id(1);
        chat2.setUsuario2Id(3);
        chat2.setProducto1Id(1);
        chat2.setProducto2Id(null);
        chat2.setActivo(false);
        chat2.setFechaQuedada("2026-10-27T14:00:00");
        chat2.setFechaDevolucion("2026-12-04T14:00:00");
        chat2.setUbicacion("Jaen");
        chat2.setCompletado(true);
        chat2.setEstadoIntercambio("devuelto");

        chatService.save(chat2);

        //SEGUIDOR
        SeguidorDTO seguidor1 = new SeguidorDTO();
        seguidor1.setIdSeguido(2);
        seguidor1.setIdSeguidor(1);

        seguidorService.save(seguidor1);

        //FAVORITO
        FavoritoDTO favorito1 = new FavoritoDTO();
        favorito1.setIdUsuario(2);
        favorito1.setIdProducto(1);

        favoritoService.save(favorito1);
    }

    // TEST 1 - GUARDAR USUARIO

    @Test
    @DisplayName("TEST POSITIVO 1 - GUARDAR COMPLETO")
    void registrarUsuario() {
        UsuarioDTO usuario2 = new UsuarioDTO();
        usuario2.setNombre("Usuario2");
        usuario2.setApellidos("De Prueba2");
        usuario2.setEmail("prueba1@gmail.com");
        usuario2.setPassword("1234");
        usuario2.setDescripcion("Soy un usuario de prueba2");
        usuario2.setDireccion("Córdoba");
        usuario2.setEstilo("Bohemio");
        usuario2.setTCamiseta("M");
        usuario2.setTPantalon(40);
        usuario2.setTCalzado(38);

        UsuarioDTO creado = usuarioService.create(usuario2);
        Optional<UsuarioDTO> usuarioCreado = usuarioService.findById(creado.getId());

        assertTrue(usuarioCreado.isPresent());
        assertEquals("Usuario2", usuarioCreado.get().getNombre());
    }

    @Test
    @DisplayName("TEST POSITIVO 1 - CAMPOS VACIOS")
    void registrarUsuarioCamposVacios() {
        UsuarioDTO usuario3 = new UsuarioDTO();
        usuario3.setNombre("Usuario3");
        usuario3.setApellidos("De Prueba3");
        usuario3.setEmail("prueba3@gmail.com");
        usuario3.setPassword("1234");
        usuario3.setDescripcion("Soy un usuario de prueba3");

        UsuarioDTO creado = usuarioService.create(usuario3);
        Optional<UsuarioDTO> usuarioCreado3 = usuarioService.findById(creado.getId());

        assertTrue(usuarioCreado3.isPresent());
        assertEquals("Usuario3", usuarioCreado3.get().getNombre());
        assertEquals("De Prueba3", usuarioCreado3.get().getApellidos());
        assertEquals("prueba3@gmail.com", usuarioCreado3.get().getEmail());
        assertEquals(null, usuarioCreado3.get().getPassword()); // La contraseña no se devuelve por seguridad
        assertEquals("Soy un usuario de prueba3", usuarioCreado3.get().getDescripcion());
    }

    @Test
    @DisplayName("TEST NEGATIVO 1 - NOMBRE VACIO")
    void registrarUsuarioSinNombre() {
        UsuarioDTO usuario4 = new UsuarioDTO();
        //Sin nombre
        usuario4.setApellidos("De Prueba4");
        usuario4.setEmail("prueba4@gmail.com");
        usuario4.setPassword("1234");

        assertThrows(IllegalArgumentException.class, () -> usuarioService.create(usuario4));
    }

    @Test
    @DisplayName("TEST NEGATIVO 1 - EMAIL REPETIDO")
    void registrarUsuarioEmailRepetido() {
        UsuarioDTO usuario5 = new UsuarioDTO();
        usuario5.setNombre("Usuario5");
        usuario5.setApellidos("De Prueba5");
        usuario5.setEmail("prueba@gmail.com"); // ya existe por el @BeforeAll
        usuario5.setPassword("1234");

        assertThrows(IllegalArgumentException.class, () -> usuarioService.create(usuario5));
    }

    // TEST 2 - CONSULTAR ESTADISTICAS USUARIO

    @Test
    @DisplayName("TEST POSITIVO 2 - ESTADISTICAS Y PRODUCTOS USUARIO1")
    void consultarUsuarioEstadisticas(){
        UsuarioEstadisticaProductosDTO estadisticas = usuarioService.obtenerUsuarioEstadisticasYproductos(1);

        assertNotNull(estadisticas);
        assertEquals(4, estadisticas.getRaiting());
        assertEquals(2, estadisticas.getPublicaciones());
        assertEquals(0, estadisticas.getSeguidores());

        assertNotNull(estadisticas.getProductosPublicados());
        assertEquals(2, estadisticas.getProductosPublicados().size());
    }

    @Test
    @DisplayName("TEST POSITIVO 2 - ESTADISTICAS Y PRODUCTOS USUARIO2")
    void consultarUsuarioEstadisticasVarias(){
        UsuarioEstadisticaProductosDTO estadisticas = usuarioService.obtenerUsuarioEstadisticasYproductos(2);

        assertNotNull(estadisticas);
        assertEquals(2, estadisticas.getId());
        assertEquals("UsuarioEstadisticas", estadisticas.getNombre());

        assertEquals(1, estadisticas.getPublicaciones());
        assertEquals(1, estadisticas.getSeguidores());
        assertEquals(0, estadisticas.getRaiting());

        assertTrue(estadisticas.getIntercambios() >= 1);

        assertNotNull(estadisticas.getProductosPublicados());
        assertEquals(1, estadisticas.getProductosPublicados().size());
    }

    @Test
    @DisplayName("TEST NEGATIVO 2 - NO EXISTENTE")
    void consultarUsuarioEstadisticasNoExistente(){
        assertThrows(ResponseStatusException.class, () -> usuarioService.obtenerUsuarioEstadisticas(999));
    }

    @Test
    @DisplayName("TEST NEGATIVO 2 - NULL")
    void consultarUsuarioEstadisticasNull(){
        assertThrows(ResponseStatusException.class, () -> usuarioService.obtenerUsuarioEstadisticas(null));
    }

    // TEST 10 - USUARIO CON MÁS INTERCAMBIOS ACEPTADOS
    @Test
    @DisplayName("TEST POSITIVO 10 - USUARIO CON MÁS INTERCAMBIOS ACEPTADOS")
    void usuarioConMasIntercambiosAceptadosTest(){
        Optional<UsuarioEstadisticaDTO> usuarioOpt = usuarioService.obtenerUsuarioConMasIntercambios();

        assertTrue(usuarioOpt.isPresent());
        UsuarioEstadisticaDTO usuario = usuarioOpt.get();

        assertEquals(1, usuario.getId());
        assertEquals("Usuario", usuario.getNombre());
    }

    @Test
    @DisplayName("TEST NEGATIVO 10 - NO EXISTEN INTERCAMBIOS")
    void usuarioConMasIntercambiosAceptadosNoExistentesTest() {

        //Eliminar los chats de intercambio
        chatService.deleteById(1);
        chatService.deleteById(2);

        Optional<UsuarioEstadisticaDTO> usuarioOpt = usuarioService.obtenerUsuarioConMasIntercambios();
        assertTrue(usuarioOpt.isEmpty());
    }

    // TEST - LOGIN

    @Test
    @DisplayName("TEST POSITIVO - LOGIN CREDENCIALES CORRECTAS")
    void loginCorrecto() {
        Optional<UsuarioDTO> resultado = usuarioService.login("prueba@gmail.com", "1234");
        assertTrue(resultado.isPresent());
        assertEquals("prueba@gmail.com", resultado.get().getEmail());
        assertNull(resultado.get().getPassword()); // nunca se expone
    }

    @Test
    @DisplayName("TEST NEGATIVO - LOGIN CONTRASEÑA INCORRECTA")
    void loginContrasenaIncorrecta() {
        Optional<UsuarioDTO> resultado = usuarioService.login("prueba@gmail.com", "wrongpassword");
        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("TEST NEGATIVO - LOGIN EMAIL NO EXISTENTE")
    void loginEmailNoExistente() {
        Optional<UsuarioDTO> resultado = usuarioService.login("noexiste@gmail.com", "1234");
        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("TEST NEGATIVO - LOGIN EMAIL NULL")
    void loginEmailNull() {
        Optional<UsuarioDTO> resultado = usuarioService.login(null, "1234");
        assertTrue(resultado.isEmpty());
    }

    // TEST - EXISTS BY EMAIL

    @Test
    @DisplayName("TEST POSITIVO - EXISTS BY EMAIL")
    void existsByEmailExistente() {
        assertTrue(usuarioService.existsByEmail("prueba@gmail.com"));
    }

    @Test
    @DisplayName("TEST NEGATIVO - EXISTS BY EMAIL NO EXISTENTE")
    void existsByEmailNoExistente() {
        assertFalse(usuarioService.existsByEmail("noexiste@gmail.com"));
    }

    @Test
    @DisplayName("TEST NEGATIVO - EXISTS BY EMAIL NULL")
    void existsByEmailNull() {
        assertFalse(usuarioService.existsByEmail(null));
    }

    // TEST - TODOS LOS USUARIOS CON ESTADÍSTICAS (BULK)

    @Test
    @DisplayName("TEST POSITIVO - OBTENER TODOS USUARIOS ESTADISTICAS")
    void obtenerTodosUsuariosEstadisticas() {
        List<UsuarioEstadisticaDTO> lista = usuarioService.obtenerTodosUsuariosEstadisticas();
        assertNotNull(lista);
        assertEquals(3, lista.size());
        // El usuario 1 tiene 2 intercambios completados
        UsuarioEstadisticaDTO u1 = lista.stream()
                .filter(u -> "prueba@gmail.com".equals(u.getEmail()))
                .findFirst()
                .orElseThrow();
        assertTrue(u1.getIntercambios() >= 2);
    }
}