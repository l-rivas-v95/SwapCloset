package org.swapcloset.backend.dto;

import lombok.Data;

@Data
public class CartaUsuarioDTO {
    private Integer id;
    private String nombre;
    private String apellidos;
    private String urlImg;
    private String direccion;
    private Double raiting;
    private Integer intercambios;
}
