package org.swapcloset.backend.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.swapcloset.backend.modelos.Usuario;

import java.util.List;
import java.util.Optional;
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    List<Usuario> findAll();

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByNombre(String nombre);

    List<Usuario> findByDireccionContainingIgnoreCase(String fragmentoDireccion);

    @EntityGraph(attributePaths = {"productos", "chatsIniciados", "chatsRecibidos"})
    Optional<Usuario> findWithProductsAndChatsById(Integer id);

    Optional<Usuario> findWithChatsById(Integer id);

    @Query("SELECT u FROM Usuario u LEFT JOIN u.seguidores s GROUP BY u ORDER BY COUNT(s) DESC LIMIT 1")
    Optional<Usuario> getUsuarioConMasSeguidores();

    @Query(value = "SELECT u.* FROM usuario u LEFT JOIN usuario_seguidores us ON u.id = us.seguido_id GROUP BY u.id ORDER BY COUNT(us.seguidor_id) DESC LIMIT 1", nativeQuery = true)
    Optional<Usuario> getUsuarioConMasSeguidoresNative();

    @Query("""
        select u.id
        from Usuario u
        join Chat c on (c.usuario1.id = u.id or c.usuario2.id = u.id)
        where c.completado = true
        group by u.id
        having count(c) > 0
        order by count(c) desc
    """)
    List<Integer> findTopUsuarioIdConMasIntercambios(org.springframework.data.domain.Pageable pageable);
}
