package org.swapcloset.backend.modelos;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Table(name = "mensaje")
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_chat", nullable = false)
    private Chat chat;

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(name = "leido", nullable = false)
    private Boolean leido = false;

    @Column(name = "id_remitente", nullable = false)
    private Integer idRemitente;

    @Column(name = "tipo", nullable = false, length = 20)
    private String tipo; // TEXTO, PRODUCTO, FECHA, UBICACION

    @Column(name = "aceptado")
    private Boolean aceptado; // null=pendiente, true=aceptado, false=rechazado (solo para propuestas)
}
