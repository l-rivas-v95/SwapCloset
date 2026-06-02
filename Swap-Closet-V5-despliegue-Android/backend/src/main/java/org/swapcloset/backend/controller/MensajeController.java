package org.swapcloset.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.swapcloset.backend.dto.MensajeDTO;
import org.swapcloset.backend.service.MensajeService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mensajes")
@CrossOrigin(origins = "http://localhost:8100")
public class MensajeController {

    private final MensajeService mensajeService;

    public MensajeController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

    @GetMapping
    public ResponseEntity<List<MensajeDTO>> getAll() {
        return ResponseEntity.ok(mensajeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MensajeDTO> getById(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        return mensajeService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(mensajeService.existsById(id));
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<MensajeDTO>> getByChat(@PathVariable Integer chatId) {
        if (chatId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(mensajeService.findByChatId(chatId));
    }

    @GetMapping("/chat/{chatId}/paged")
    public ResponseEntity<Page<MensajeDTO>> getByChatPaged(@PathVariable Integer chatId, Pageable pageable) {
        if (chatId == null) return ResponseEntity.badRequest().build();

        List<MensajeDTO> all = mensajeService.findByChatId(chatId);
        if (all.isEmpty()) {
            return ResponseEntity.ok(Page.empty(pageable));
        }

        int total = all.size();
        int start = (int) pageable.getOffset();
        if (start >= total) {
            return ResponseEntity.ok(new PageImpl<>(List.of(), pageable, total));
        }
        int end = Math.min(start + pageable.getPageSize(), total);
        List<MensajeDTO> content = all.subList(start, end);
        Page<MensajeDTO> page = new PageImpl<>(content, pageable, total);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/chat/{chatId}/last")
    public ResponseEntity<MensajeDTO> getLastByChat(@PathVariable Integer chatId) {
        if (chatId == null) return ResponseEntity.badRequest().build();
        Optional<MensajeDTO> last = mensajeService.findLastByChatId(chatId);
        return last.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<MensajeDTO>> searchByTexto(@RequestParam String texto) {
        if (texto == null || texto.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(mensajeService.searchByTexto(texto));
    }

    @GetMapping("/leidos")
    public ResponseEntity<List<MensajeDTO>> getLeidos() {
        return ResponseEntity.ok(mensajeService.findLeidos());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MensajeDTO dto) {
        if (dto == null) return ResponseEntity.badRequest().body("MensajeDTO no debe ser null");
        try {
            MensajeDTO created = mensajeService.save(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody MensajeDTO dto) {
        if (id == null || dto == null) return ResponseEntity.badRequest().build();
        if (!mensajeService.existsById(id)) return ResponseEntity.notFound().build();
        dto.setId(id);
        try {
            MensajeDTO updated = mensajeService.update(dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        if (!mensajeService.existsById(id)) return ResponseEntity.notFound().build();
        mensajeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}