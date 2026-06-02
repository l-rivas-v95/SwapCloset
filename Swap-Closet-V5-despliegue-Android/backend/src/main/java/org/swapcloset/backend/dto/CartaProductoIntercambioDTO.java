package org.swapcloset.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.swapcloset.backend.modelos.TipoProducto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CartaProductoIntercambioDTO {

    //Producto
    private Integer id;
    private String tipo;
    private String precio;
    private String titulo;
    private String estilo;
    private String descripcion;
    private String marca;
    private String estado;
    private String categoria;
    private String talla;
    private String color;
    private String fechaDevolucion;
    private String fechaCreacion;
    private Integer idUsuario;
    private Boolean activo;

    private Integer intercambios;

    public CartaProductoIntercambioDTO(
            Integer id,
            TipoProducto tipo,
            BigDecimal precio,
            String titulo,
            String estilo,
            String descripcion,
            String marca,
            String estado,
            String categoria,
            String talla,
            String color,
            LocalDateTime fechaDevolucion,
            LocalDateTime fechaCreacion,
            Integer idUsuario,
            Boolean activo,
            Long intercambios
    ) {
        this.id = id;
        this.tipo = (tipo != null) ? tipo.name() : null;
        this.precio = (precio != null) ? precio.toPlainString() : null;
        this.titulo = titulo;
        this.estilo = estilo;
        this.descripcion = descripcion;
        this.marca = marca;
        this.estado = estado;
        this.categoria = categoria;
        this.talla = talla;
        this.color = color;
        this.fechaDevolucion = (fechaDevolucion != null) ? fechaDevolucion.toString() : null;
        this.fechaCreacion = (fechaCreacion != null) ? fechaCreacion.toString() : null;
        this.idUsuario = idUsuario;
        this.activo = activo;
        this.intercambios = (intercambios != null) ? intercambios.intValue() : 0;
    }

}
