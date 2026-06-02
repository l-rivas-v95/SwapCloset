package org.swapcloset.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ImagenProductoDTO {
    private Integer id;
    @NotNull(message = "La URL de la imagen es obligatoria")
    private String urlImg;
    @NotNull(message = "El orden es obligatorio")
    private Integer orden;
    @NotNull(message = "El ID del producto es obligatorio")
    private Integer idProducto;
}
