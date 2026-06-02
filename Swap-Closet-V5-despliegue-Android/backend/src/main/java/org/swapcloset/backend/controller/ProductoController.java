package org.swapcloset.backend.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.swapcloset.backend.dto.CartaProductoDTO;
import org.swapcloset.backend.dto.CartaProductoIntercambioDTO;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.modelos.TipoProducto;
import org.swapcloset.backend.service.ProductoService;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:8100")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> getAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<ProductoDTO>> getActivePaged(Pageable pageable) {
        return ResponseEntity.ok(productoService.findActivePage(pageable));
    }

    @GetMapping("/carta-producto/{id}")
    public ResponseEntity<CartaProductoDTO> getCartaProductoById(@PathVariable Integer id){
        CartaProductoDTO cartaProductoDTO = productoService.getCartaProductoDTOidProducto(id);
        if(cartaProductoDTO != null){
            return ResponseEntity.ok(cartaProductoDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/carta-producto/all-activos")
    public ResponseEntity<List<CartaProductoDTO>> getAllCartasProductosActivos(){
        List<CartaProductoDTO> cartasProductosDTO = productoService.getAllCartasProductosDTOActivos();
        return ResponseEntity.ok(cartasProductosDTO);
    }

    @GetMapping("/filtrado")
    public ResponseEntity<List<ProductoDTO>> getByCategoriaAndTallaAndEstado(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String talla,
            @RequestParam(required = false) String estado) {
        List<ProductoDTO> productos = productoService.filtrar(categoria, talla, estado);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/carta-producto/intercambios/{idProducto}")
    public ResponseEntity<CartaProductoIntercambioDTO> getCartasProductosIntercambiosByProducto(@PathVariable Integer idProducto){
        CartaProductoIntercambioDTO cartaProductoIntercambioDTO = productoService.getCartaProductoIntercambioDTOidProducto(idProducto);
        if(cartaProductoIntercambioDTO != null){
            return ResponseEntity.ok(cartaProductoIntercambioDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/carta-producto/intercambios/all")
    public ResponseEntity<List<CartaProductoIntercambioDTO>> getAllCartasProductosIntercambios(){
        List<CartaProductoIntercambioDTO> cartasProductosIntercambiosDTO = productoService.getTodasCartasProductosIntercambio();
        return ResponseEntity.ok(cartasProductosIntercambiosDTO);
    }

    @GetMapping("/carta-producto/intercambios/all-activos")
    public ResponseEntity<List<CartaProductoIntercambioDTO>> getAllCartasProductosIntercambiosActivos(){
        List<CartaProductoIntercambioDTO> cartasProductosIntercambiosDTO = productoService.getTodasCartasProductosIntercambioActivos();
        return ResponseEntity.ok(cartasProductosIntercambiosDTO);
    }

    @GetMapping("/carta-producto-activos/{idUsuario}")
    public ResponseEntity<List<CartaProductoDTO>> getCartasProductosActivosByUsuario(@PathVariable Integer idUsuario){
        List<CartaProductoDTO> cartasProductosDTO = productoService.getCartasProductosDTOByUsuarioIdAndActivo(idUsuario);
        return ResponseEntity.ok(cartasProductosDTO);
    }

    @GetMapping("/top5-intercambios")
    public ResponseEntity<List<CartaProductoIntercambioDTO>> getTop5ProductosMasIntercambiados(){
        List<CartaProductoIntercambioDTO> top5ProductosIntercambiados = productoService.getTop5ProductosConMasIntercambios();
        return ResponseEntity.ok(top5ProductosIntercambiados);
    }

    @GetMapping("/top5-intercambios-activos")
    public ResponseEntity<List<CartaProductoIntercambioDTO>> getTop5ProductosMasIntercambiadosActivos(){
        List<CartaProductoIntercambioDTO> top5ProductosIntercambiados = productoService.getTop5ProductosConMasIntercambiosActivos();
        return ResponseEntity.ok(top5ProductosIntercambiados);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getById(@PathVariable Integer id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> create(@Valid @RequestBody ProductoDTO productoDTO) {
        ProductoDTO created = productoService.save(productoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


    @PostMapping("/guardar")
    public ResponseEntity<Map<String, String>> subirFoto(@RequestParam("archivo") MultipartFile archivo) {
        try {
            String nombreArchivo = archivo.getOriginalFilename();
            Path ruta = Paths.get("src/main/resources/static/img/" + nombreArchivo);
            Files.copy(archivo.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);

            Map<String, String> response = new HashMap<>();
            response.put("url", "/assets/img/" + nombreArchivo);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> update(@PathVariable Integer id, @Valid @RequestBody ProductoDTO productoDTO) {
        if (!productoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoDTO.setId(id);
        ProductoDTO updated = productoService.update(productoDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!productoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ProductoDTO>> getProductosByUsuario(@PathVariable Integer usuarioId) {
        List<ProductoDTO> productos = productoService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ProductoDTO>> getByCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(productoService.findByCategoria(categoria));
    }

    @GetMapping("/marca/{marca}")
    public ResponseEntity<List<ProductoDTO>> getByMarca(@PathVariable String marca) {
        return ResponseEntity.ok(productoService.findByMarca(marca));
    }

    @GetMapping("/talla/{talla}")
    public ResponseEntity<List<ProductoDTO>> getByTalla(@PathVariable String talla) {
        return ResponseEntity.ok(productoService.findByTalla(talla));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<ProductoDTO>> getByTipo(@PathVariable String tipo) {
        TipoProducto tp = parseTipo(tipo);
        if (tp == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoService.findByTipo(tp));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoDTO>> searchByTitulo(@RequestParam String titulo) {
        return ResponseEntity.ok(productoService.searchByTitulo(titulo));
    }

    @GetMapping("/precio")
    public ResponseEntity<List<ProductoDTO>> getByPrecioRange(@RequestParam BigDecimal min,
                                                              @RequestParam BigDecimal max) {
        return ResponseEntity.ok(productoService.findByPrecioRange(min, max));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<ProductoDTO>> getDisponibles() {
        return ResponseEntity.ok(productoService.findAvailableProducts());
    }

    @GetMapping("/color/{color}")
    public ResponseEntity<List<ProductoDTO>> getByColor(@PathVariable String color) {
        return ResponseEntity.ok(productoService.findByColor(color));
    }

    private TipoProducto parseTipo(String tipo) {
        if (tipo == null) return null;
        String n = tipo.trim().toLowerCase(Locale.ROOT);
        if (n.contains("intercambio") || n.contains("intercamb")) return TipoProducto.intercambio;
        if (n.contains("prestamo") || n.contains("préstamo") || n.contains("presta")) return TipoProducto.prestamo;
        return null;
    }
}