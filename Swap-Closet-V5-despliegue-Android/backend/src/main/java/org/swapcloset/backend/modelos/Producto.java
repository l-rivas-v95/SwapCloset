package org.swapcloset.backend.modelos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "tipo", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoProducto tipo;

    @Column(name = "precio", precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "titulo", length = 50, nullable = false)
    private String titulo;

    @Column(name = "estilo", length = 30, nullable = false)
    private String estilo;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Column(name = "marca", length = 20, nullable = false)
    private String marca;

    @Column(name = "estado", length = 20, nullable = false)
    private String estado;

    @Column(name = "categoria", length = 20, nullable = false)
    private String categoria;

    @Column(name = "talla", length = 4, nullable = false)
    private String talla;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "fecha_devolucion")
    private LocalDateTime fechaDevolucion;

    @Column(name = "fecha_creacion")
    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;


    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImagenProducto> imagenes;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Favorito> favoritos;

    @OneToMany(mappedBy = "producto1", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Chat> chatsProducto1;

    @OneToMany(mappedBy = "producto2", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Chat> chatsProducto2;
}