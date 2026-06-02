package org.swapcloset.backend.modelos;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import lombok.*;
import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RaitingId implements Serializable {

    private Integer idPuntuado;
    private Integer idPuntuador;
}
