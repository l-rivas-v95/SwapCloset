package org.swapcloset.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Data
public class ProductoDTO {
    //@Null(message = "El id no debe enviarse al crear un producto")
    private Integer id;
    @NotBlank(message = "El tipo no puede estar vacío")
    @NotNull(message = "El tipo no puede ser nulo")
    @Pattern(regexp = "intercambio|prestamo", message = "El tipo debe ser 'intercambio' o 'prestamo'")
    private String tipo;
    @Max(value = 150, message = "El precio máximo es 150€")
    @Min(value = 1, message = "El precio mínimo es 1€")
    private String precio;
    @NotBlank(message = "El título no puede estar vacío")
    @NotNull(message = "El título no puede ser nulo")
    private String titulo;
    @NotNull(message = "El estilo no puede ser nulo")
    @NotBlank(message = "El estilo no puede estar vacío")
    private String estilo;
    @NotNull(message = "La descripción no puede ser nula")
    @NotBlank(message = "La descripción no puede estar vacía")
    private String descripcion;
    @NotNull(message = "La marca no puede ser nula")
    @NotBlank(message = "La marca no puede estar vacía")
    private String marca;
    @NotBlank(message = "El estado no puede estar vacío")
    @NotNull(message = "El estado no puede ser nulo")
    private String estado;
    @NotBlank(message = "La categoría no puede estar vacía")
    @NotNull(message = "La categoría no puede ser nula")
    private String categoria;
    @NotNull(message = "La talla no puede ser nula")
    @NotBlank(message = "La talla no puede estar vacía")
    private String talla;
    @NotNull(message = "El color no puede ser nulo")
    @NotBlank(message = "El color no puede estar vacío")
    private String color;
    @NotNull(message = "La fecha de devolución no puede ser nula")
    @NotBlank(message = "La fecha de devolución no puede no puede estar vacía")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}", message = "La fecha de devolución debe tener formato yyyy-MM-dd'T'HH:mm:ss")
    private String fechaDevolucion;
    private String fechaCreacion;
    @NotNull(message = "El idUsuario no puede ser nulo")
    private Integer idUsuario;
    private Boolean activo;

    private List<ImagenProductoDTO> imagenes;
    //private List<FavoritoDTO> favoritos;
    //private List<ChatDTO> chatsProducto1;
    //private List<ChatDTO> chatsProducto2;

}
