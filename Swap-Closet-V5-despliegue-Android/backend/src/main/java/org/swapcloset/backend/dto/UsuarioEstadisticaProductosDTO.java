package org.swapcloset.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.swapcloset.backend.modelos.Producto;

import java.util.List;

@Data
public class UsuarioEstadisticaProductosDTO {
    private Integer id;
    private String nombre;
    private String apellidos;
    private String email;
    private String descripcion;
    private String estilo;
    private String urlImg;
    private String direccion;
    @JsonProperty("tCamiseta")
    private String tCamiseta;
    @JsonProperty("tPantalon")
    private Integer tPantalon;
    @JsonProperty("tCalzado")
    private Integer tCalzado;

    private Double raiting;
    private Integer publicaciones;
    private Integer intercambios;
    private Integer seguidores;

    private List<ProductoDTO> productosPublicados;

}
