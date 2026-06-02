package org.swapcloset.backend.modelos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Table(name = "chat")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario1", nullable = false)
    @JsonIgnore
    private Usuario usuario1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario2", nullable = false)
    @JsonIgnore
    private Usuario usuario2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto1", nullable = false)
    private Producto producto1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto2")
    private Producto producto2;

    @Column(name = "fecha_creacion")
    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_quedada")
    private LocalDateTime fechaQuedada;

    @Column(name = "fecha_devolucion")
    private LocalDateTime fechaDevolucion;

    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    @Column(name = "completado")
    private Boolean completado;

    @Column(name = "estado")
    @Enumerated(EnumType.STRING)
    private TipoEstadoIntercambio estadoIntercambio;

    // Relación 1:N con Mensaje
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Mensaje> mensajes;
}
