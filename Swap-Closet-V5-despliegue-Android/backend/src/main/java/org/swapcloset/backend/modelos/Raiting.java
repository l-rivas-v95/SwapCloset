package org.swapcloset.backend.modelos;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "raiting")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Raiting {

    @EmbeddedId
    private RaitingId id;

    @MapsId("idPuntuado")
    @ManyToOne
    @JoinColumn(name = "id_puntuado")
    private Usuario puntuado;

    @MapsId("idPuntuador")
    @ManyToOne
    @JoinColumn(name = "id_puntuador")
    private Usuario puntuador;

    @Column(name = "puntuacion")
    private Integer puntuacion;
}