package org.swapcloset.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class MensajeDTO {
    private Integer id;
    private Integer idChat;
    private String contenido;
    private String fechaEnvio;
    private Boolean leido;
}
