package org.swapcloset.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swapcloset.backend.dto.ProductoHistoricoDTO;
import org.swapcloset.backend.modelos.AccionHistorico;
import org.swapcloset.backend.modelos.TipoProducto;
import org.swapcloset.backend.service.ProductoHistoricoService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/productos-historico")
@CrossOrigin(origins = "http://localhost:8100")
public class ProductoHistoricoController {

    private final ProductoHistoricoService productoHistoricoService;

    public ProductoHistoricoController(ProductoHistoricoService productoHistoricoService) {
        this.productoHistoricoService = productoHistoricoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoHistoricoDTO>> getAll() {
        return ResponseEntity.ok(productoHistoricoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoHistoricoDTO> getById(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        return productoHistoricoService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ProductoHistoricoDTO dto) {
        if (dto == null) return ResponseEntity.badRequest().body("ProductoHistoricoDTO no debe ser null");
        try {
            ProductoHistoricoDTO created = productoHistoricoService.save(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody ProductoHistoricoDTO dto) {
        if (id == null || dto == null) return ResponseEntity.badRequest().build();
        if (!productoHistoricoService.existsById(id)) return ResponseEntity.notFound().build();
        dto.setId(id);
        try {
            ProductoHistoricoDTO updated = productoHistoricoService.update(dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        if (!productoHistoricoService.existsById(id)) return ResponseEntity.notFound().build();
        productoHistoricoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ProductoHistoricoDTO>> getByProductoId(@PathVariable Integer productoId) {
        if (productoId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByProductoId(productoId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ProductoHistoricoDTO>> getByUsuario(@PathVariable Integer usuarioId) {
        if (usuarioId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByUsuarioId(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/paged")
    public ResponseEntity<Page<ProductoHistoricoDTO>> getByUsuarioPaged(@PathVariable Integer usuarioId, Pageable pageable) {
        if (usuarioId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByUsuarioId(usuarioId, pageable));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<ProductoHistoricoDTO>> getByTipo(@PathVariable String tipo) {
        TipoProducto tp = parseTipo(tipo);
        if (tp == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByTipo(tp));
    }

    @GetMapping("/tipo/{tipo}/paged")
    public ResponseEntity<Page<ProductoHistoricoDTO>> getByTipoPaged(@PathVariable String tipo, Pageable pageable) {
        TipoProducto tp = parseTipo(tipo);
        if (tp == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByTipo(tp, pageable));
    }

    @GetMapping("/accion/{accion}")
    public ResponseEntity<List<ProductoHistoricoDTO>> getByAccion(@PathVariable String accion) {
        AccionHistorico a = parseAccion(accion);
        if (a == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByAccion(a));
    }

    @GetMapping("/accion/{accion}/paged")
    public ResponseEntity<Page<ProductoHistoricoDTO>> getByAccionPaged(@PathVariable String accion, Pageable pageable) {
        AccionHistorico a = parseAccion(accion);
        if (a == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByAccion(a, pageable));
    }

    @GetMapping("/precio")
    public ResponseEntity<List<ProductoHistoricoDTO>> getByPrecioRange(@RequestParam BigDecimal min,
                                                                       @RequestParam BigDecimal max) {
        if (min == null || max == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByPrecioRange(min, max));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoHistoricoDTO>> searchByTitulo(@RequestParam String titulo) {
        if (titulo == null || titulo.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.searchByTitulo(titulo));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<ProductoHistoricoDTO>> getAvailable() {
        return ResponseEntity.ok(productoHistoricoService.findAvailableProducts());
    }

    @GetMapping("/color/{color}")
    public ResponseEntity<List<ProductoHistoricoDTO>> getByColor(@PathVariable String color) {
        if (color == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(productoHistoricoService.findByColor(color));
    }

    @GetMapping("/vence-antes")
    public ResponseEntity<List<ProductoHistoricoDTO>> getDueForReturn(@RequestParam String fecha) {
        if (fecha == null || fecha.isBlank()) return ResponseEntity.badRequest().build();
        LocalDate fechaLimite = LocalDate.parse(fecha);
        return ResponseEntity.ok(productoHistoricoService.findByFechaCreacionBefore(fechaLimite.atStartOfDay()));
    }

    @GetMapping("/fecha-creacion-after")
    public ResponseEntity<List<ProductoHistoricoDTO>> getByFechaCreacionAfter(@RequestParam String fecha) {
        if (fecha == null || fecha.isBlank()) return ResponseEntity.badRequest().build();
        LocalDate fechaLimite = LocalDate.parse(fecha);
        return ResponseEntity.ok(productoHistoricoService.findByFechaCreacionAfter(fechaLimite.atStartOfDay()));
    }

    private TipoProducto parseTipo(String tipo) {
        if (tipo == null) return null;
        String n = tipo.trim().toLowerCase(Locale.ROOT);
        if (n.equals("intercambio")) return TipoProducto.intercambio;
        if (n.equals("prestamo") || n.equals("préstamo")) return TipoProducto.prestamo;
        return null;
    }

    private AccionHistorico parseAccion(String accion) {
        if (accion == null) return null;
        try {
            return AccionHistorico.valueOf(accion.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}