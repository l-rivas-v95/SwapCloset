package org.swapcloset.backend.serviceUnitary;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.dto.*;
import org.swapcloset.backend.service.ChatService;
import org.swapcloset.backend.service.ImagenProductoService;
import org.swapcloset.backend.service.ProductoService;
import org.swapcloset.backend.service.UsuarioService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ProductoServiceTest {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ImagenProductoService imagenProductoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ChatService chatService;

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

        //USUSARIO1
        UsuarioDTO usuario2 = new UsuarioDTO();
        usuario2.setNombre("Usuario 2");
        usuario2.setApellidos("De Prueba 2");
        usuario2.setEmail("prueba2@gmail.com");
        usuario2.setPassword("1234");
        usuario2.setDescripcion("Soy un usuario de prueba2");

        usuarioService.create(usuario2);

        UsuarioDTO usuario3 = new UsuarioDTO();
        usuario3.setNombre("Usuario 3");
        usuario3.setApellidos("De Prueba 3");
        usuario3.setEmail("prueba3@gmil.com");
        usuario3.setPassword("1234");
        usuario3.setDescripcion("Soy un usuario de prueba 3");
        usuarioService.create(usuario3);

        UsuarioDTO usuario4 = new UsuarioDTO();
        usuario4.setNombre("Usuario 4");
        usuario4.setApellidos("De Prueba 3");
        usuario4.setEmail("prueba5@gmil.com");
        usuario4.setPassword("1234");
        usuario4.setDescripcion("Soy un usuario de prueba 3");
        usuarioService.create(usuario4);

        //PRODUCTO
        ProductoDTO producto1 = new ProductoDTO();
        producto1.setIdUsuario(1);
        producto1.setTitulo("Producto Intercambio");
        producto1.setTipo("Intercambio");
        producto1.setDescripcion("Descripción del producto de prueba");
        producto1.setEstilo("Bohemio");
        producto1.setMarca("MarcaX");
        producto1.setEstado("EstadoX");
        producto1.setCategoria("Pantalon");
        producto1.setTalla("42");
        producto1.setColor("ColorX");
        producto1.setFechaDevolucion("2025-11-25T07:35:11");
        producto1.setActivo(true);

        productoService.save(producto1);

        ProductoDTO producto2 = new ProductoDTO();
        producto2.setIdUsuario(2);
        producto2.setTitulo("Producto Intercambio 2");
        producto2.setTipo("Intercambio");
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

        ProductoDTO producto3 = new ProductoDTO();
        producto3.setIdUsuario(1);
        producto3.setTitulo("Producto Intercambio 3");
        producto3.setTipo("Intercambio");
        producto3.setDescripcion("Descripción del producto de prueba 2");
        producto3.setEstilo("Casual");
        producto3.setMarca("Adidas");
        producto3.setEstado("Bueno");
        producto3.setCategoria("Camisa");
        producto3.setTalla("M");
        producto3.setColor("ColorY");
        producto3.setFechaDevolucion("2025-12-01T10:00:00");
        producto3.setActivo(true);

        productoService.save(producto3);

        ProductoDTO producto4 = new ProductoDTO();
        producto4.setIdUsuario(2);
        producto4.setTitulo("Producto Intercambio 4");
        producto4.setTipo("Intercambio");
        producto4.setDescripcion("Descripción del producto de prueba 3");
        producto4.setEstilo("Moderno");
        producto4.setMarca("Zara");
        producto4.setEstado("Excelente");
        producto4.setCategoria("Casual");
        producto4.setTalla("M");
        producto4.setColor("ColorZ");
        producto4.setFechaDevolucion("2025-12-15T15:30:00");
        producto4.setActivo(true);

        productoService.save(producto4);

        ProductoDTO producto5 = new ProductoDTO();
        producto5.setIdUsuario(4);
        producto5.setTitulo("Producto Intercambio 5");
        producto5.setTipo("Intercambio");
        producto5.setDescripcion("Descripción del producto de prueba 4");
        producto5.setEstilo("Deportivo");
        producto5.setMarca("Puma");
        producto5.setEstado("Nuevo");
        producto5.setCategoria("Deporte");
        producto5.setTalla("L");
        producto5.setColor("ColorA");
        producto5.setFechaDevolucion("2026-01-10T09:00:00");
        producto5.setActivo(true);
        productoService.save(producto5);

        ProductoDTO producto55 = new ProductoDTO();
        producto55.setIdUsuario(4);
        producto55.setTitulo("Producto Intercambio 5");
        producto55.setTipo("Intercambio");
        producto55.setDescripcion("Descripción del producto de prueba 4");
        producto55.setEstilo("Deportivo");
        producto55.setMarca("Puma");
        producto55.setEstado("Nuevo");
        producto55.setCategoria("Deporte");
        producto55.setTalla("L");
        producto55.setColor("ColorA");
        producto55.setFechaDevolucion("2026-01-10T09:00:00");
        producto55.setActivo(true);
        productoService.save(producto55);

        ProductoDTO producto6 = new ProductoDTO();
        producto6.setIdUsuario(2);
        producto6.setTitulo("Producto Intercambio 6");
        producto6.setTipo("Intercambio");
        producto6.setDescripcion("Descripción del producto de prueba 5");
        producto6.setEstilo("Elegante");
        producto6.setMarca("Gucci");
        producto6.setEstado("Muy Bueno");
        producto6.setCategoria("Formal");
        producto6.setTalla("XL");
        producto6.setColor("ColorB");
        producto6.setFechaDevolucion("2026-02-20T11:00:00");
        producto6.setActivo(true);
        productoService.save(producto6);

        ProductoDTO producto7 = new ProductoDTO();
        producto7.setIdUsuario(3);
        producto7.setTitulo("Producto Intercambio 7");
        producto7.setTipo("Intercambio");
        producto7.setDescripcion("Descripción del producto de prueba 6");
        producto7.setEstilo("Casual");
        producto7.setMarca("Levis");
        producto7.setEstado("Bueno");
        producto7.setCategoria("Jeans");
        producto7.setTalla("32");
        producto7.setColor("ColorC");
        producto7.setFechaDevolucion("2026-03-15T10:00:00");
        producto7.setActivo(true);
        productoService.save(producto7);

        ProductoDTO producto8 = new ProductoDTO();
        producto8.setIdUsuario(3);
        producto8.setTitulo("Producto Intercambio 8");
        producto8.setTipo("Intercambio");
        producto8.setDescripcion("Descripción del producto de prueba 7");
        producto8.setEstilo("Moderno");
        producto8.setMarca("H&M");
        producto8.setEstado("Excelente");
        producto8.setCategoria("Camisa");
        producto8.setTalla("L");
        producto8.setColor("ColorD");
        producto8.setFechaDevolucion("2026-04-25T12:00:00");
        producto8.setActivo(true);
        productoService.save(producto8);

        //CHATS
        ChatDTO chat1 = new ChatDTO();
        chat1.setUsuario1Id(1);
        chat1.setUsuario2Id(2);
        chat1.setProducto1Id(1);
        chat1.setProducto2Id(2);
        chat1.setActivo(false);
        chat1.setFechaQuedada("2026-10-27T14:00:00");
        chat1.setFechaDevolucion("2026-12-04T14:00:00");
        chat1.setUbicacion("Jaen");
        chat1.setCompletado(true);
        chat1.setEstadoIntercambio("devuelto");
        chatService.save(chat1);

        ChatDTO chat2 = new ChatDTO();
        chat2.setUsuario1Id(1);
        chat2.setUsuario2Id(2);
        chat2.setProducto1Id(1);
        chat2.setProducto2Id(2);
        chat2.setActivo(false);
        chat2.setFechaQuedada("2026-11-15T10:00:00");
        chat2.setFechaDevolucion("2026-12-15T10:00:00");
        chat2.setUbicacion("Madrid");
        chat2.setCompletado(true);
        chat2.setEstadoIntercambio("devuelto");
        chatService.save(chat2);

        ChatDTO chat3 = new ChatDTO();
        chat3.setUsuario1Id(1);
        chat3.setUsuario2Id(2);
        chat3.setProducto1Id(1);
        chat3.setProducto2Id(2);
        chat3.setActivo(false);
        chat3.setFechaQuedada("2026-12-01T16:00:00");
        chat3.setFechaDevolucion("2026-12-31T16:00:00");
        chat3.setUbicacion("Barcelona");
        chat3.setCompletado(true);
        chat3.setEstadoIntercambio("devuelto");
        chatService.save(chat3);

        ChatDTO chat4 = new ChatDTO();
        chat4.setUsuario1Id(1);
        chat4.setUsuario2Id(2);
        chat4.setProducto1Id(3);
        chat4.setProducto2Id(4);
        chat4.setActivo(false);
        chat4.setFechaQuedada("2027-01-10T09:00:00");
        chat4.setFechaDevolucion("2027-02-10T09:00:00");
        chat4.setUbicacion("Valencia");
        chat4.setCompletado(true);
        chat4.setEstadoIntercambio("devuelto");
        chatService.save(chat4);

        ChatDTO chat5 = new ChatDTO();
        chat5.setUsuario1Id(1);
        chat5.setUsuario2Id(3);
        chat5.setProducto1Id(1);
        chat5.setProducto2Id(6);
        chat5.setActivo(false);
        chat5.setFechaQuedada("2027-02-20T11:00:00");
        chat5.setFechaDevolucion("2027-03-20T11:00:00");
        chat5.setUbicacion("Sevilla");
        chat5.setCompletado(true);
        chat5.setEstadoIntercambio("devuelto");
        chatService.save(chat5);

        ChatDTO chat6 = new ChatDTO();
        chat6.setUsuario1Id(2);
        chat6.setUsuario2Id(1);
        chat6.setProducto1Id(2);
        chat6.setProducto2Id(3);
        chat6.setActivo(false);
        chat6.setFechaQuedada("2027-03-15T10:00:00");
        chat6.setFechaDevolucion("2027-04-15T10:00:00");
        chat6.setUbicacion("Bilbao");
        chat6.setCompletado(true);
        chat6.setEstadoIntercambio("devuelto");
        chatService.save(chat6);

        ChatDTO chat7 = new ChatDTO();
        chat7.setUsuario1Id(3);
        chat7.setUsuario2Id(1);
        chat7.setProducto1Id(6);
        chat7.setProducto2Id(3);
        chat7.setActivo(false);
        chat7.setFechaQuedada("2027-04-25T12:00:00");
        chat7.setFechaDevolucion("2027-05-25T12:00:00");
        chat7.setUbicacion("Granada");
        chat7.setCompletado(true);
        chat7.setEstadoIntercambio("devuelto");
        chatService.save(chat7);

        ChatDTO chat8 = new ChatDTO();
        chat8.setUsuario1Id(1);
        chat8.setUsuario2Id(3);
        chat8.setProducto1Id(1);
        chat8.setProducto2Id(7);
        chat8.setActivo(false);
        chat8.setFechaQuedada("2027-05-30T14:00:00");
        chat8.setFechaDevolucion("2027-06-30T14:00:00");
        chat8.setUbicacion("Alicante");
        chat8.setCompletado(true);
        chat8.setEstadoIntercambio("devuelto");
        chatService.save(chat8);

        ChatDTO chat9 = new ChatDTO();
        chat9.setUsuario1Id(4);
        chat9.setUsuario2Id(2);
        chat9.setProducto1Id(5);
        chat9.setProducto2Id(2);
        chat9.setActivo(false);
        chat9.setFechaQuedada("2027-05-30T14:00:00");
        chat9.setFechaDevolucion("2027-06-30T14:00:00");
        chat9.setUbicacion("Alicante");
        chat9.setCompletado(true);
        chat9.setEstadoIntercambio("devuelto");
        chatService.save(chat9);

    }

    // TEST 3 - GUARDAR PRODUCTO

    @Test
    @DisplayName("CASO POSITIVO 3 - INTERCAMBIO")
    void CrearProductoIntercambio(){

        //Producto
        ProductoDTO producto1 = new ProductoDTO();
        producto1.setIdUsuario(1);
        producto1.setTitulo("Producto Intercambio");
        producto1.setTipo("Intercambio");
        producto1.setDescripcion("Descripción del producto de prueba");
        producto1.setEstilo("Bohemio");
        producto1.setMarca("Adidas");
        producto1.setEstado("Bueno");
        producto1.setCategoria("CategoriaX");
        producto1.setTalla("M");
        producto1.setColor("Rojo");
        producto1.setFechaDevolucion("2025-11-25T07:35:11");
        producto1.setActivo(true);

        ProductoDTO creado = productoService.save(producto1);
        Optional<ProductoDTO> productoCreado =productoService.findById(creado.getId());

        //Imagen
        ImagenProductoDTO imagenProducto1 = new ImagenProductoDTO();
        imagenProducto1.setIdProducto(creado.getId());
        imagenProducto1.setUrlImg("ruta/imagen1.jpg");
        imagenProducto1.setOrden(1);

        imagenProductoService.save(imagenProducto1);

        assertTrue(productoCreado.isPresent());
        assertEquals("Producto Intercambio", productoCreado.get().getTitulo());
        assertEquals("Intercambio", productoCreado.get().getTipo());
        assertEquals(null, productoCreado.get().getPrecio());
    }

    @Test
    @DisplayName("CASO POSITIVO 3 - PRÉSTAMO")
    void CrearProductoPrestamo(){
        ProductoDTO producto2 = new ProductoDTO();
        producto2.setIdUsuario(2);
        producto2.setTitulo("Producto Préstamo");
        producto2.setTipo("Préstamo");
        producto2.setPrecio("10.50");
        producto2.setDescripcion("Descripción del producto de prueba");
        producto2.setEstilo("Bohemio");
        producto2.setMarca("MarcaX");
        producto2.setEstado("EstadoX");
        producto2.setCategoria("CategoriaX");
        producto2.setTalla("M");
        producto2.setColor("ColorX");
        producto2.setFechaDevolucion("2025-11-25T07:35:11");
        producto2.setActivo(true);

        ProductoDTO creado = productoService.save(producto2);
        Optional<ProductoDTO> productoCreado =productoService.findById(creado.getId());

        //Imagen
        ImagenProductoDTO imagenProducto1 = new ImagenProductoDTO();
        imagenProducto1.setIdProducto(creado.getId());
        imagenProducto1.setUrlImg("ruta/imagen1.jpg");
        imagenProducto1.setOrden(1);

        imagenProductoService.save(imagenProducto1);

        assertTrue(productoCreado.isPresent());
        assertEquals("Producto Préstamo", productoCreado.get().getTitulo());
        assertEquals("Préstamo", productoCreado.get().getTipo());
        assertEquals("10.5", productoCreado.get().getPrecio());
    }

    @Test
    @DisplayName("CASO NEGATIVO 3 - PRÉSTAMO SIN PRECIO")
    void CrearProductoPrestamoSinPrecio(){
        ProductoDTO producto2 = new ProductoDTO();
        producto2.setIdUsuario(2);
        producto2.setTitulo("Producto Préstamo");
        producto2.setTipo("Préstamo");
        // Falta el precio
        producto2.setDescripcion("Descripción del producto de prueba");
        producto2.setEstilo("Bohemio");
        producto2.setMarca("MarcaX");
        producto2.setEstado("EstadoX");
        producto2.setCategoria("CategoriaX");
        producto2.setTalla("M");
        producto2.setColor("ColorX");
        producto2.setFechaDevolucion("2025-11-25T07:35:11");
        producto2.setActivo(true);

        assertThrows(ResponseStatusException.class, () -> {productoService.save(producto2);});
    }

    @Test
    @DisplayName("CASO NEGATIVO 3 - INTERCAMBIO CON PRECIO")
    void CrearProductoIntercambioConPrecio(){
        ProductoDTO producto2 = new ProductoDTO();
        producto2.setIdUsuario(2);
        producto2.setTitulo("Producto Préstamo");
        producto2.setTipo("Intercambio");
        producto2.setPrecio("10.50"); // No debería tener precio
        producto2.setDescripcion("Descripción del producto de prueba");
        producto2.setEstilo("Bohemio");
        producto2.setMarca("MarcaX");
        producto2.setEstado("EstadoX");
        producto2.setCategoria("CategoriaX");
        producto2.setTalla("M");
        producto2.setColor("ColorX");
        producto2.setFechaDevolucion("2025-11-25T07:35:11");
        producto2.setActivo(true);

        assertThrows(ResponseStatusException.class, () -> {productoService.save(producto2);});
    }

    // TEST 4 - FILTRO

    @Test
    @DisplayName("CASO POSITIVO 4 - FILTRAR POR CATEGORÍA Y TALLA")
    void filtrarProductosPorCategoriaYTalla(){
        String categoria = "Pantalon";
        String talla = "42";

        var resultados = productoService.filtrar(categoria, talla, "");
        assertNotNull(resultados);

        resultados.stream().forEach(producto -> {
            assertEquals(categoria, producto.getCategoria());
            assertEquals(talla, producto.getTalla());
        });
    }

    @Test
    @DisplayName("CASO POSITIVO 4 - FILTRAR POR CATEGORÍA, TALLA Y ESTADO")
    void filtrarProductosPorCategoriaTallaYEstado(){
        String categoria = "Casual";
        String talla = "M";
        String estado = "Bueno";

        var resultados = productoService.filtrar(categoria, talla, estado);
        assertNotNull(resultados);

        resultados.stream().forEach(producto -> {
            assertEquals(categoria, producto.getCategoria());
            assertEquals(talla, producto.getTalla());
            assertEquals(estado, producto.getEstado());
        });
    }

    @Test
    @DisplayName("CASO NEGATIVO 4 - FILTRAR SIN RESULTADOS")
    void filtrarProductosSinResultados(){
        String categoria = "NoExistente";
        String talla = "XXL";

        var resultados = productoService.filtrar(categoria, talla, "");
        assertNotNull(resultados);
        assertTrue(resultados.isEmpty());
    }

    @Test
    @DisplayName("CASO NEGATIVO 4 - FILTRAR CON DATOS NULL")
    void filtrarProductosConDatosNulos(){
        String categoria = null;
        String talla = null;
        String estado = null;

        var resultados = productoService.filtrar(categoria, talla, estado);

        assertNotNull(resultados);

        assertEquals(resultados.size() >= 1, true);
        assertEquals(resultados.get(0).getId() == 1, true);
    }

    // TEST 5 - EDITAR PRODUCTO

    @Test
    @DisplayName("CASO POSITIVO 5 - EDITAR DATOS PARCIALES DEL PRODUCTO")
    void editarProductoExistente(){
        Optional<ProductoDTO> productoOpt = productoService.findById(1);
        assertTrue(productoOpt.isPresent());

        ProductoDTO producto = productoOpt.get();
        producto.setTitulo("Producto editado parcialmente");
        producto.setDescripcion("Descripción editada parcialmente");

        ProductoDTO actualizado = productoService.update(producto);

        assertEquals("Producto editado parcialmente", actualizado.getTitulo());
        assertEquals("Descripción editada parcialmente", actualizado.getDescripcion());
    }

    @Test
    @DisplayName("CASO POSITIVO 5 - EDITAR TODOS LOS CAMPOS DEL PRODUCTO")
    void editarTodosLosCamposProductoExistente(){
        Optional<ProductoDTO> productoOpt = productoService.findById(2);
        assertTrue(productoOpt.isPresent());

        ProductoDTO producto = productoOpt.get();
        producto.setTitulo("Producto Editado Completo");
        producto.setTipo("Intercambio");
        producto.setPrecio(null);
        producto.setDescripcion("Descripción editada completamente");
        producto.setEstilo("Moderno");
        producto.setMarca("Adidas");
        producto.setEstado("Excelente");
        producto.setCategoria("Camisa");
        producto.setTalla("L");
        producto.setColor("Azul");
        producto.setFechaDevolucion("2025-12-31T12:00:00");
        producto.setActivo(false);

        ProductoDTO actualizado = productoService.update(producto);

        assertEquals("Producto Editado Completo", actualizado.getTitulo());
        assertEquals("Intercambio", actualizado.getTipo());
        assertNull(actualizado.getPrecio());
        assertEquals("Descripción editada completamente", actualizado.getDescripcion());
        assertEquals("Moderno", actualizado.getEstilo());
        assertEquals("Adidas", actualizado.getMarca());
        assertEquals("Excelente", actualizado.getEstado());
        assertEquals("Camisa", actualizado.getCategoria());
        assertEquals("L", actualizado.getTalla());
        assertEquals("Azul", actualizado.getColor());
        assertEquals("2025-12-31T12:00:00", actualizado.getFechaDevolucion());
        assertFalse(actualizado.getActivo());
    }

    @Test
    @DisplayName("CASO NEGATIVO 5 - EDITAR PRODUCTO NO EXISTENTE")
    void editarProductoNoExistente(){
        ProductoDTO producto = new ProductoDTO();
        producto.setId(999); // ID no existente
        producto.setTitulo("Producto No Existente");

        assertThrows(ResponseStatusException.class, () -> {productoService.update(producto);});
    }

    @Test
    @DisplayName("CASO NEGATIVO 5 - EDITAR PRODUCTO CON TIPO INVÁLIDO")
    void editarProductoConTipoInvalido() {
        Optional<ProductoDTO> productoOpt = productoService.findById(1);
        assertTrue(productoOpt.isPresent());
        ProductoDTO producto = productoOpt.get();
        producto.setTipo("Venta"); // Tipo inválido
        assertThrows(ResponseStatusException.class, () -> {
            productoService.update(producto);
        });
    }

    //TEST 9 - TOP 5 INTERCAMBIOS

    @Test
    @DisplayName("CASO POSITIVO 9 - OBTENER TOP 5 PRODUCTOS CON MÁS INTERCAMBIOS")
    void obtenerTop5ProductosConMasIntercambios(){
        List<CartaProductoIntercambioDTO> top5 = productoService.getTop5ProductosConMasIntercambios();
        assertNotNull(top5);
        assertTrue(top5.size() == 5);
    }

    @Test
    @DisplayName("CASO POSITIVO 9 - OBTENER TOP 5 PRODUCTOS CON MÁS INTERCAMBIOS PERO SOLO HAY 4")
    void obtenerTop5ProductosConMasIntercambiosSolo() {

        // Primero desactivamos algunos productos para que solo queden 4 activos
        productoService.deleteById(5);
        productoService.deleteById(55);
        productoService.deleteById(6);
        productoService.deleteById(7);
        productoService.deleteById(8);

        List<CartaProductoIntercambioDTO> top5 = productoService.getTop5ProductosConMasIntercambios();
        assertNotNull(top5);
        System.out.println(top5);
        assertTrue(top5.size() == 3);
    }

    @Test
    @DisplayName("CASO NEGATIVO 9 - OBTENER TOP 5 PRODUCTOS CON MÁS INTERCAMBIOS CUANDO NO HAY NINGUNO")
    void obtenerTop5ProductosConMasIntercambiosNinguno() {

        // Primero desactivamos todos los productos
        productoService.deleteById(1);
        productoService.deleteById(2);
        productoService.deleteById(3);
        productoService.deleteById(4);
        productoService.deleteById(55);
        productoService.deleteById(5);
        productoService.deleteById(6);
        productoService.deleteById(7);
        productoService.deleteById(8);
        productoService.deleteById(9);

        List<CartaProductoIntercambioDTO> top5 = productoService.getTop5ProductosConMasIntercambios();
        assertNotNull(top5);
        assertTrue(top5.isEmpty());

    }

}
