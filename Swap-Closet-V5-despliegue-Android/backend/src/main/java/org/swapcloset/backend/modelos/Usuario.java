package org.swapcloset.backend.modelos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nombre", length = 20, nullable = false)
    private String nombre;

    @Column(name = "apellidos", length = 50, nullable = false)
    private String apellidos;

    @Column(name = "email", length = 50, nullable = false, unique = true)
    private String email;

    @Column(name = "password", length = 100, nullable = false)
    private String password;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Column(name = "estilo", length = 30)
    private String estilo;

    @Column(name = "url_img", length = 500)
    private String urlImg;

    @Column(name = "direccion", length = 500)
    private String direccion;

    @Column(name = "t_camiseta", length = 4)
    private String tCamiseta;

    @Column(name = "t_pantalon")
    private Integer tPantalon;

    @Column(name = "t_calzado")
    private Integer tCalzado;


    //  Relación 1:N con Producto
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Producto> productos;

    @OneToMany(mappedBy = "usuario1", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Chat> chatsIniciados;

    @OneToMany(mappedBy = "usuario2", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Chat> chatsRecibidos;

    // Relación 1:N con Favorito (productos marcados como favorito por el usuario)
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Favorito> favoritos;

    @OneToMany(mappedBy = "seguido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Seguidor> seguidores;

    @OneToMany(mappedBy = "seguidor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Seguidor> siguiendo;

    // Relación 1:N con Raiting (recibidos)
    @OneToMany(mappedBy = "puntuado", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Raiting> raitingsRecibidos;

    // Relación 1:N con Raiting (dados)
    @OneToMany(mappedBy = "puntuador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Raiting> raitingsDados;
}