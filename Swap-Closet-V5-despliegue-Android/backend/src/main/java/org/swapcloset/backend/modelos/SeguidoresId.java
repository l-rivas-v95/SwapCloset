package org.swapcloset.backend.modelos;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class SeguidoresId implements Serializable {

    private Integer idSeguidor;
    private Integer idSeguido;
}
