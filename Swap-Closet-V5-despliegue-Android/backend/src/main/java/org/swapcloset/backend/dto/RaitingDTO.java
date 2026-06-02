package org.swapcloset.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Getter
@Setter
public class RaitingDTO {
    @NotNull(message = "El ID del usuario puntuado es obligatorio")
    private Integer idPuntuado;
    @NotNull(message = "El ID del usuario puntuador es obligatorio")
    private Integer idPuntuador;
    @NotNull(message = "La puntuación no puede ser nula")
    @Min(value = 0)
    @Max(value = 5)
    private Integer puntuacion;
}