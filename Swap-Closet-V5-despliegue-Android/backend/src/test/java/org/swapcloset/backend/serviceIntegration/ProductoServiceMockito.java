package org.swapcloset.backend.serviceIntegration;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.converter.ProductoMapper;
import org.swapcloset.backend.dto.CartaProductoIntercambioDTO;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.modelos.Producto;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.ProductoRepository;
import org.swapcloset.backend.repository.UsuarioRepository;
import org.swapcloset.backend.service.ProductoService;
import org.swapcloset.backend.service.UsuarioService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceMockito {
    @Spy
    @InjectMocks
    private ProductoService productoService;
    @Mock
    private ProductoMapper productoMapper;
    @Mock
    private UsuarioService usuarioService;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private ProductoRepository productoRepository;
    @Mock
    private EntityManager em;

    @Test
    @DisplayName("TEST INTEGRACIÓN 3 - CREAR UN PRODUCTO")
    void crearProductoMockito() {

        ProductoDTO productoDTO = new ProductoDTO();
        productoDTO.setIdUsuario(1);
        productoDTO.setTipo("Intercambio");

        Producto entidad = new Producto();
        Producto saved = new Producto();
        ProductoDTO savedDTO = new ProductoDTO();

        Mockito.when(em.getReference(Mockito.eq(Usuario.class), Mockito.eq(productoDTO.getIdUsuario()))).thenReturn(new Usuario());
        Mockito.when(usuarioRepository.existsById(productoDTO.getIdUsuario())).thenReturn(true);
        Mockito.when(productoMapper.toDTO(Mockito.any(Producto.class))).thenReturn(savedDTO);
        Mockito.when(productoMapper.toEntity(Mockito.any(ProductoDTO.class))).thenReturn(entidad);
        Mockito.when(productoRepository.save(Mockito.any(Producto.class))).thenReturn(saved);

        // THEN
        ProductoDTO res = productoService.save(productoDTO);

        // WHEN
        assertNotNull(res);
        assertNull(productoDTO.getId(), "El ID del producto creado debe ser null en el DTO simulado");

        Mockito.verify(productoRepository, Mockito.times(1)).save(Mockito.any(Producto.class));
        Mockito.verify(usuarioRepository).existsById(1);
        Mockito.verify(productoMapper).toEntity(Mockito.any(ProductoDTO.class));
        Mockito.verify(productoRepository).save(Mockito.any(Producto.class));
        Mockito.verify(productoMapper).toDTO(Mockito.any(Producto.class));
    }

    @Test
    @DisplayName("TEST INTEGRACIÓN 4 - FILTRAR POR CATEGORÍA Y TALLA")
    void filtrarPorCategoriaYTallaMockito() {

        // GIVEN
        String categoria = "Pantalon";
        String talla = "42";
        String estado = null;

        Producto producto = new Producto();
        ProductoDTO productoDTO = new ProductoDTO();

        Mockito.when(productoRepository.findByCategoriaAndTallaAndActivoTrue(categoria, talla)).thenReturn(List.of(producto));
        Mockito.when(productoMapper.toDTO(Mockito.any(Producto.class))).thenReturn(productoDTO);

        // WHEN
        List<ProductoDTO> resultado = productoService.filtrar(categoria, talla, estado);

        // THEN
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(productoDTO, resultado.get(0));

        // solo el metodo correcto del repo
        Mockito.verify(productoRepository).findByCategoriaAndTallaAndActivoTrue(categoria, talla);

        // NO se deben llamar otros métodos
        Mockito.verifyNoMoreInteractions(productoRepository);
        Mockito.verify(productoMapper).toDTO(producto);
    }

    @Test
    @DisplayName("TEST INTEGRACIÓN 5 - EDITAR PRODUCTO NO EXISTENTE")
    void editarProductoNoExistenteMockito() {

        //GIVEN
        ProductoDTO productoDTO = new ProductoDTO();
        productoDTO.setId(999); // ID no existente
        productoDTO.setTipo("Intercambio");


        Mockito.when(productoRepository.existsById(productoDTO.getId())).thenReturn(false);

        // THEN
        Exception exception = assertThrows(ResponseStatusException.class, () -> {
            productoService.update(productoDTO);
        });

        // WHEN
        String expectedMessage = "No existe Producto con id: " + productoDTO.getId();
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));

        Mockito.verify(productoRepository).existsById(productoDTO.getId());
    }

    @Test
    @DisplayName("INTEGRACIÓN 9 - CONSULTAR TOP 5 PRODUCTOS CON MÁS INTERCAMBIOS")
    void getTop5ProductosConMasIntercambiosMockito() {

        // GIVEN
        CartaProductoIntercambioDTO dto1 = new CartaProductoIntercambioDTO();
        dto1.setId(1);
        dto1.setTitulo("Producto 1");
        dto1.setIntercambios(10);

        CartaProductoIntercambioDTO dto2 = new CartaProductoIntercambioDTO();
        dto2.setId(2);
        dto2.setTitulo("Producto 2");
        dto2.setIntercambios(8);

        CartaProductoIntercambioDTO dto3 = new CartaProductoIntercambioDTO();
        dto2.setId(3);
        dto2.setTitulo("Producto 3");
        dto2.setIntercambios(7);

        CartaProductoIntercambioDTO dto4 = new CartaProductoIntercambioDTO();
        dto2.setId(4);
        dto2.setTitulo("Producto 4");
        dto2.setIntercambios(5);

        List<CartaProductoIntercambioDTO> mockResultado = List.of(dto1, dto2, dto3, dto4);

        Mockito.when(productoRepository.topProductosConMasIntercambios(PageRequest.of(0, 5)))
                .thenReturn(mockResultado);

        // WHEN
        List<CartaProductoIntercambioDTO> res = productoService.getTop5ProductosConMasIntercambios();

        // THEN
        assertNotNull(res);
        assertEquals(4, res.size());

        // VERIFY
        Mockito.verify(productoRepository)
                .topProductosConMasIntercambios(PageRequest.of(0, 5));

        Mockito.verifyNoMoreInteractions(productoRepository);
    }

}
