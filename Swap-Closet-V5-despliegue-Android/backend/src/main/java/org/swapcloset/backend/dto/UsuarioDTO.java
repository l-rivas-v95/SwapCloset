package org.swapcloset.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Data
public class UsuarioDTO {
    private Integer id;
    @NotNull(message = "El nombre ni puede ser nulo")
    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;
    @NotNull(message = "Los apellidos no pueden ser nulos")
    @NotBlank(message = "Los apellidos no pueden estar vacíos")
    private String apellidos;
    @Email(message = "El email no es válido")
    private String email;
    @NotNull(message = "La contraseña no puede ser nula")
    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;
    private String descripcion;
    private String estilo;
    private String urlImg;
    private String direccion;
    @Pattern(regexp = "XS|S|M|L|XL", message = "La talla de camiseta debe ser XS, S, M, L o XL")
    @JsonProperty("tCamiseta")
    private String tCamiseta;
    @Min(value = 38, message = "La talla de pantalón mínima es 38")
    @Max(value = 46, message = "La talla de pantalón máxima es 46")
    @JsonProperty("tPantalon")
    private Integer tPantalon;
    @Min(value = 36, message = "La talla de calzado mínima es 36")
    @Max(value = 42, message = "La talla de calzado máxima es 42")
    @JsonProperty("tCalzado")
    private Integer tCalzado;

    private List<ProductoDTO> productos;
}
