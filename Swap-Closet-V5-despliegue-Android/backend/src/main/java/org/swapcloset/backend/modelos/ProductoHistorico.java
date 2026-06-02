package org.swapcloset.backend.modelos;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "producto_historico")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class ProductoHistorico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    // referencia a producto (permite SET NULL en la BD)
    @ManyToOne(optional = true)
    @JoinColumn(name = "id_producto", referencedColumnName = "id")
    private Producto producto;

    @ManyToOne(optional = true)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoProducto tipo;

    @Enumerated(EnumType.STRING)
    @Column(name = "accion", nullable = false)
    private AccionHistorico accion;

    @Column(name = "titulo", length = 50)
    private String titulo;

    @Column(name = "estilo", length = 30)
    private String estilo;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Column(name = "marca", length = 20)
    private String marca;

    @Column(name = "categoria", length = 20)
    private String categoria;

    @Column(name = "talla", length = 4)
    private String talla;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "precio")
    private BigDecimal precio;

    @Column(name = "fecha_devolucion")
    private LocalDateTime fechaDevolucion;

    @Column(name = "fecha_creacion")
    @CreationTimestamp
    private LocalDateTime fechaCreacion;
}
