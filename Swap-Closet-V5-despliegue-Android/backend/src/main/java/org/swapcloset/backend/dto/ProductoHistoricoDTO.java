package org.swapcloset.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.swapcloset.backend.modelos.AccionHistorico;
import org.swapcloset.backend.modelos.TipoProducto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductoHistoricoDTO {

    private Integer id;
    private Integer idProducto;
    private Integer idUsuario;
    private TipoProducto tipo;
    private AccionHistorico accion;
    private String titulo;
    private String estilo;
    private String descripcion;
    private String marca;
    private String categoria;
    private String talla;
    private String color;
    private BigDecimal precio;
    private String fechaDevolucion;
    private String fechaCreacion;
}
