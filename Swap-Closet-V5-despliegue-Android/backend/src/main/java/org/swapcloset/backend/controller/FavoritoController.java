package org.swapcloset.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swapcloset.backend.dto.CartaProductoDTO;
import org.swapcloset.backend.dto.FavoritoDTO;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.modelos.FavoritoId;
import org.swapcloset.backend.modelos.Producto;
import org.swapcloset.backend.service.FavoritoService;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "http://localhost:8100")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping
    public ResponseEntity<List<FavoritoDTO>> getAll() {
        return ResponseEntity.ok(favoritoService.findAll());
    }

    @GetMapping("/{idUsuario}/{idProducto}")
    public ResponseEntity<FavoritoDTO> getById(@PathVariable Integer idUsuario,
                                               @PathVariable Integer idProducto) {
        if (idUsuario == null || idProducto == null) return ResponseEntity.badRequest().build();
        FavoritoId id = new FavoritoId(idUsuario, idProducto);
        return favoritoService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}/productos")
    public ResponseEntity<List<ProductoDTO>> getProductosFavoritosByUsuario(@PathVariable Integer idUsuario) {
        List<ProductoDTO> productos = favoritoService.findProductosFavoritosByUsuarioId(idUsuario);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/carta-productos-favoritos/{idUsuario}")
    public ResponseEntity<List<CartaProductoDTO>> findCartaProductosFavoritosByUsuarioId(@PathVariable Integer idUsuario) {
        List<CartaProductoDTO> productos = favoritoService.findCartaProductosFavoritosByUsuarioId(idUsuario);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/usuario/{idUsuario}/count")
    public ResponseEntity<Integer> getCountFavoritosByUsuario(@PathVariable Integer idUsuario) {
        Integer count = favoritoService.findCountFavoritosByUsuarioId(idUsuario);
        return ResponseEntity.ok(count);
    }


    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<FavoritoDTO>> getByUsuario(@PathVariable Integer idUsuario) {
        if (idUsuario == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(favoritoService.findByUsuarioId(idUsuario));
    }

    @GetMapping("/producto/{idProducto}")
    public ResponseEntity<List<FavoritoDTO>> getByProducto(@PathVariable Integer idProducto) {
        if (idProducto == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(favoritoService.findByProductoId(idProducto));
    }

    @GetMapping("/exists/{idUsuario}/{idProducto}")
    public ResponseEntity<Boolean> exists(@PathVariable Integer idUsuario,
                                          @PathVariable Integer idProducto) {
        if (idUsuario == null || idProducto == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(favoritoService.existsByUserAndProduct(idUsuario, idProducto));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody FavoritoDTO dto) {
        if (dto == null || dto.getIdUsuario() == null || dto.getIdProducto() == null) {
            return ResponseEntity.badRequest().body("idUsuario e idProducto son obligatorios");
        }
        try {
            FavoritoDTO created = favoritoService.save(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{idUsuario}/{idProducto}")
    public ResponseEntity<?> update(@PathVariable Integer idUsuario,
                                    @PathVariable Integer idProducto,
                                    @RequestBody FavoritoDTO dto) {
        if (idUsuario == null || idProducto == null || dto == null) return ResponseEntity.badRequest().build();

        // asegurar que el DTO use la misma clave compuesta de la ruta
        dto.setIdUsuario(idUsuario);
        dto.setIdProducto(idProducto);

        FavoritoId id = new FavoritoId(idUsuario, idProducto);
        if (!favoritoService.existsById(id)) return ResponseEntity.notFound().build();

        try {
            FavoritoDTO updated = favoritoService.update(dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{idUsuario}/{idProducto}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer idUsuario,
                                           @PathVariable Integer idProducto) {
        if (idUsuario == null || idProducto == null) return ResponseEntity.badRequest().build();
        FavoritoId id = new FavoritoId(idUsuario, idProducto);
        if (!favoritoService.existsById(id)) return ResponseEntity.notFound().build();
        favoritoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteByUserAndProduct(@RequestParam Integer idUsuario,
                                                       @RequestParam Integer idProducto) {
        if (idUsuario == null || idProducto == null) return ResponseEntity.badRequest().build();
        favoritoService.deleteByUserAndProduct(idUsuario, idProducto);
        return ResponseEntity.noContent().build();
    }
}