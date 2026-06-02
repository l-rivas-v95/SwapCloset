// language: java
package org.swapcloset.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swapcloset.backend.dto.RaitingDTO;
import org.swapcloset.backend.modelos.RaitingId;
import org.swapcloset.backend.service.RaitingService;

import java.util.List;

@RestController
@RequestMapping("/api/raitings")
@CrossOrigin(origins = "http://localhost:8100")
public class RaitingController {

    private final RaitingService raitingService;

    public RaitingController(RaitingService raitingService) {
        this.raitingService = raitingService;
    }

    @GetMapping
    public ResponseEntity<List<RaitingDTO>> getAll() {
        return ResponseEntity.ok(raitingService.findAll());
    }

    @GetMapping("/usuario/{idUsuario}/media")
    public ResponseEntity<Double> obtenerMediaUsuario(@PathVariable Integer idUsuario) {
        if (idUsuario == null) {
            return ResponseEntity.badRequest().build();
        }

        Double media = raitingService.obtenerMediaPuntuacionUsuario(idUsuario);
        return ResponseEntity.ok(media);
    }

    @GetMapping("/{idPuntuado}/{idPuntuador}")
    public ResponseEntity<RaitingDTO> getById(@PathVariable Integer idPuntuado,
                                              @PathVariable Integer idPuntuador) {
        RaitingId id = new RaitingId(idPuntuado, idPuntuador);
        return raitingService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/puntuado/{idPuntuado}")
    public ResponseEntity<List<RaitingDTO>> getByPuntuado(@PathVariable Integer idPuntuado) {
        if (idPuntuado == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(raitingService.findByPuntuadoId(idPuntuado));
    }

    @GetMapping("/puntuador/{idPuntuador}")
    public ResponseEntity<List<RaitingDTO>> getByPuntuador(@PathVariable Integer idPuntuador) {
        if (idPuntuador == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(raitingService.findByPuntuadorId(idPuntuador));
    }

    @GetMapping("/exists/{idPuntuado}/{idPuntuador}")
    public ResponseEntity<Boolean> exists(@PathVariable Integer idPuntuado,
                                          @PathVariable Integer idPuntuador) {
        RaitingId id = new RaitingId(idPuntuado, idPuntuador);
        return ResponseEntity.ok(raitingService.existsById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<?> crear(@Valid @RequestBody RaitingDTO dto) {

        if (dto.getIdPuntuado() == null || dto.getIdPuntuador() == null) {
            return ResponseEntity.badRequest().body("Los ids de puntuado y puntuador son obligatorios");
        }

        RaitingDTO creado = raitingService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{idPuntuado}/{idPuntuador}")
    public ResponseEntity<?> update(@PathVariable Integer idPuntuado,
                                    @PathVariable Integer idPuntuador,
                                    @Valid @RequestBody RaitingDTO dto) {
        if (dto == null) return ResponseEntity.badRequest().build();
        dto.setIdPuntuado(idPuntuado);
        dto.setIdPuntuador(idPuntuador);
        RaitingId id = new RaitingId(idPuntuado, idPuntuador);
        if (!raitingService.existsById(id)) return ResponseEntity.notFound().build();
        try {
            RaitingDTO updated = raitingService.update(dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{idPuntuado}/{idPuntuador}")
    public ResponseEntity<Void> delete(@PathVariable Integer idPuntuado,
                                       @PathVariable Integer idPuntuador) {
        RaitingId id = new RaitingId(idPuntuado, idPuntuador);
        if (!raitingService.existsById(id)) return ResponseEntity.notFound().build();
        raitingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}