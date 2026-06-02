package org.swapcloset.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swapcloset.backend.dto.*;
import org.swapcloset.backend.service.FavoritoService;
import org.swapcloset.backend.service.ProductoService;
import org.swapcloset.backend.service.UsuarioService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:8100")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private ProductoService productoService;

    public UsuarioController(UsuarioService usuarioService, FavoritoService favoritoService, ProductoService productoService) {
        this.usuarioService = usuarioService;
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getById(@PathVariable Integer id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/estadisticas/{id}")
    public ResponseEntity<UsuarioEstadisticaDTO> obtenerEstadisticas(@PathVariable Integer id) {
        try {
            UsuarioEstadisticaDTO dto = usuarioService.obtenerUsuarioEstadisticas(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/estadisticas-productos/{id}")
    public ResponseEntity<UsuarioEstadisticaProductosDTO> obtenerEstadisticasProductos(@PathVariable Integer id) {
        try {
            UsuarioEstadisticaProductosDTO dto = usuarioService.obtenerUsuarioEstadisticasYproductos(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/estadisticas-all")
    public ResponseEntity<List<UsuarioEstadisticaDTO>> obtenerEstadisticasTodos() {
        List<UsuarioEstadisticaDTO> estadisticas = usuarioService.obtenerTodosUsuariosEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/usuario-mayor-intercambios")
    public ResponseEntity<UsuarioEstadisticaDTO> obtenerUsuarioConMayorIntercambios() {
        Optional<UsuarioEstadisticaDTO> usuarioOpt = usuarioService.obtenerUsuarioConMasIntercambios();
        return usuarioOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/carta-usuario/{id}")
    public ResponseEntity<Optional<CartaUsuarioDTO>> obtenerCartaUsuario(@PathVariable Integer id) {
        try {
            Optional<CartaUsuarioDTO> dto = usuarioService.obtenerCartaUsuarioPorId(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/exists/email")
    public ResponseEntity<Boolean> existsByEmail(@RequestParam String email) {
        if (email == null || email.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(usuarioService.existsByEmail(email));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@RequestBody LoginDTO loginRequest) {
        Optional<UsuarioDTO> usuarioOpt = usuarioService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (usuarioOpt.isPresent()) {
            return ResponseEntity.ok(usuarioOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @GetMapping("/{id}/with-relations")
    public ResponseEntity<UsuarioDTO> getWithRelations(@PathVariable Integer id) {
        return usuarioService.findWithProductsAndChatsById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/email")
    public ResponseEntity<UsuarioDTO> getByEmail(@RequestParam String email) {
        if (email == null || email.isBlank()) return ResponseEntity.badRequest().build();
        return usuarioService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<UsuarioDTO>> getByNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(usuarioService.findByNombre(nombre));
    }

    @GetMapping("/ubicacion/{ubicacion}")
    public ResponseEntity<List<UsuarioDTO>> getByUbicacion(@PathVariable String ubicacion) {
        return ResponseEntity.ok(usuarioService.findByDireccionContaining(ubicacion));
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.existsById(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> create(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO created = usuarioService.create(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> update(@PathVariable Integer id, @RequestBody UsuarioDTO usuarioDTO) {
        if (!usuarioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioDTO.setId(id);
        UsuarioDTO updated = usuarioService.update(usuarioDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!usuarioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}