package org.swapcloset.backend.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swapcloset.backend.dto.ImagenProductoDTO;
import org.swapcloset.backend.service.ImagenProductoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/imagenes-producto")
@CrossOrigin(origins = "http://localhost:8100")
public class ImagenProductoController {

    private final ImagenProductoService imagenProductoService;

    public ImagenProductoController(ImagenProductoService imagenProductoService) {
        this.imagenProductoService = imagenProductoService;
    }

    @GetMapping
    public ResponseEntity<List<ImagenProductoDTO>> getAll() {
        return ResponseEntity.ok(imagenProductoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagenProductoDTO> getById(@PathVariable Integer id) {
        return imagenProductoService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/img-principal/{id}")
    public ResponseEntity<String> getImagenPrincipal(@PathVariable Integer id) {
        String urlImagen = imagenProductoService.getPrimeraImagen(id);
        if (urlImagen != null) {
            return ResponseEntity.ok(urlImagen);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/by-producto")
    public ResponseEntity<List<ImagenProductoDTO>> getByProducto(@RequestParam Integer productoId) {
        if (productoId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(imagenProductoService.findByProductoId(productoId));
    }

    @GetMapping("/by-producto/paged")
    public ResponseEntity<Page<ImagenProductoDTO>> getByProductoPaged(@RequestParam Integer productoId, Pageable pageable) {
        if (productoId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(imagenProductoService.findByProductoId(productoId, pageable));
    }

    @GetMapping("/by-producto/ordenados")
    public ResponseEntity<List<ImagenProductoDTO>> getByProductoOrderByOrden(@RequestParam Integer productoId) {
        if (productoId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(imagenProductoService.findByProductoIdOrderByOrdenAsc(productoId));
    }

    @GetMapping("/principal")
    public ResponseEntity<ImagenProductoDTO> getPrincipal(@RequestParam Integer productoId) {
        if (productoId == null) return ResponseEntity.badRequest().build();
        Optional<ImagenProductoDTO> principal = imagenProductoService.findPrincipalByProductoId(productoId);
        return principal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-producto/orden")
    public ResponseEntity<ImagenProductoDTO> getByProductoAndOrden(@RequestParam Integer productoId,
                                                                   @RequestParam Integer orden) {
        if (productoId == null || orden == null) return ResponseEntity.badRequest().build();
        return imagenProductoService.findByProductoIdAndOrden(productoId, orden)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        return ResponseEntity.ok(imagenProductoService.existsById(id));
    }

    @GetMapping("/exists/by-producto-and-orden")
    public ResponseEntity<Boolean> existsByProductoAndOrden(@RequestParam Integer productoId,
                                                            @RequestParam Integer orden) {
        if (productoId == null || orden == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(imagenProductoService.existsByProductoIdAndOrden(productoId, orden));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ImagenProductoDTO>> searchByUrlFragment(@RequestParam String fragment) {
        if (fragment == null || fragment.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(imagenProductoService.findByUrlFragment(fragment));
    }

    @PutMapping("/principal")
    public ResponseEntity<ImagenProductoDTO> actualizarImagenPrincipal(@RequestBody ImagenProductoDTO dto) {
        return ResponseEntity.ok(
                imagenProductoService.guardarOActualizarPrincipal(dto.getIdProducto(), dto.getUrlImg()));
    }


    @PostMapping("/create")
    public ResponseEntity<ImagenProductoDTO> create(@Valid @RequestBody ImagenProductoDTO dto) {
        ImagenProductoDTO created = imagenProductoService.save(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ImagenProductoDTO> update(@PathVariable Integer id, @Valid @RequestBody ImagenProductoDTO dto) {
        if (id == null || dto == null) return ResponseEntity.badRequest().build();
        if (!imagenProductoService.existsById(id)) return ResponseEntity.notFound().build();
        dto.setId(id);
        ImagenProductoDTO updated = imagenProductoService.update(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        if (!imagenProductoService.existsById(id)) return ResponseEntity.notFound().build();
        imagenProductoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/by-producto")
    public ResponseEntity<Void> deleteByProducto(@RequestParam Integer productoId) {
        if (productoId == null) return ResponseEntity.badRequest().build();
        imagenProductoService.deleteByProductoId(productoId);
        return ResponseEntity.noContent().build();
    }
}