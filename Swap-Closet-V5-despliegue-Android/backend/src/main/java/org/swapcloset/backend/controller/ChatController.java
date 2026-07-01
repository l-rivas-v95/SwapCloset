package org.swapcloset.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.swapcloset.backend.dto.ChatDTO;
import org.swapcloset.backend.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public ResponseEntity<List<ChatDTO>> getAll() {
        return ResponseEntity.ok(chatService.findAll());
    }

    @GetMapping("/cantidadIntercambios/{id}")
    public ResponseEntity<Integer> getCantidadIntercambios(@PathVariable Integer id) {
        Integer cantidad = chatService.getCantidadIntercambios(id);
        return ResponseEntity.ok(cantidad);
    }
    @GetMapping("/cantidadPrestamos/{id}")
    public ResponseEntity<Integer> getCantidadPrestamos(@PathVariable Integer id) {
        Integer cantidad = chatService.getCantidadPrestamos(id);
        return ResponseEntity.ok(cantidad);
    }

    @GetMapping("/cantidadTotalIntercambios/{id}")
    public ResponseEntity<Integer> getCantidadTotalIntercambios(@PathVariable Integer id) {
        Integer cantidad = chatService.getCantidadTotalIntercambios(id);
        return ResponseEntity.ok(cantidad);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatDTO> getById(@PathVariable Integer id) {
        return chatService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ChatDTO> create(@Valid @RequestBody ChatDTO dto) {
        ChatDTO saved = chatService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChatDTO> update(@PathVariable Integer id,@Valid @RequestBody ChatDTO dto) {
        dto.setId(id);
        ChatDTO updated = chatService.update(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        chatService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ChatDTO>> getByUsuario(@PathVariable Integer usuarioId, Authentication auth) {
        Integer tokenUserId = (Integer) auth.getCredentials();
        if (!usuarioId.equals(tokenUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(chatService.findByUsuarioId(usuarioId));
    }

    @PostMapping("/find-or-create")
    public ResponseEntity<ChatDTO> findOrCreate(
            @RequestParam Integer usuario1Id,
            @RequestParam Integer usuario2Id,
            @RequestParam Integer producto1Id,
            Authentication auth) {
        Integer tokenUserId = (Integer) auth.getCredentials();
        if (!usuario1Id.equals(tokenUserId) && !usuario2Id.equals(tokenUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ChatDTO chat = chatService.findOrCreate(usuario1Id, usuario2Id, producto1Id);
        return ResponseEntity.ok(chat);
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<ChatDTO> confirmar(@PathVariable Integer id, Authentication auth) {
        Integer tokenUserId = (Integer) auth.getCredentials();
        ChatDTO updated = chatService.confirmar(id, tokenUserId);
        return ResponseEntity.ok(updated);
    }
}