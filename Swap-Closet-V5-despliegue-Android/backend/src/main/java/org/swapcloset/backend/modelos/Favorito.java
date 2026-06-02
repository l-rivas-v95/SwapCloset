package org.swapcloset.backend.modelos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)

@Table(name = "favorito")
public class Favorito {

    @EmbeddedId
    private FavoritoId id;

    @MapsId("idUsuario")
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @MapsId("idProducto")
    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;
}
