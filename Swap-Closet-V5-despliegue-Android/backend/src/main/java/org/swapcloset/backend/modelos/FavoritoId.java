package org.swapcloset.backend.modelos;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class FavoritoId implements Serializable {

    private Integer idUsuario;
    private Integer idProducto;
}
