package org.swapcloset.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartaProductoDTO {

    //Producto
    private Integer productoId;
    private String tipo;
    private String precio;
    private String titulo;
    private String estado;
    private String talla;
    private String fechaDevolucion;
    private String fechaCreacion;
    private Boolean activo;

    //ImagenProducto
    private String urlImgProducto;

    //Usuario
    private Integer usuarioId;
    private String nombreUsuario;
    private String apellidosUsuario;
    private String urlImgUsuario;
    private String ubicacionUsuario;

    //Raiting
    private Double raiting;

}
