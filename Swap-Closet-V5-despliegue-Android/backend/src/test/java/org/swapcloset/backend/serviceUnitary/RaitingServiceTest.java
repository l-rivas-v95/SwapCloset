package org.swapcloset.backend.serviceUnitary;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.dto.RaitingDTO;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.service.RaitingService;
import org.swapcloset.backend.service.UsuarioService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class RaitingServiceTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RaitingService raitingService;

    @BeforeAll
    void cargarDatos() {
        //USUSARIO1
        UsuarioDTO usuario1 = new UsuarioDTO();
        usuario1.setNombre("Usuario");
        usuario1.setApellidos("De Prueba");
        usuario1.setEmail("prueba@gmail.com");
        usuario1.setPassword("1234");
        usuario1.setDescripcion("Soy un usuario de prueba");

        usuarioService.create(usuario1);

        //USUARIO2
        UsuarioDTO usuarioRaiting = new UsuarioDTO();
        usuarioRaiting.setNombre("UsuarioEstadisticas");
        usuarioRaiting.setApellidos("De Prueba");
        usuarioRaiting.setEmail("raiting@gmail.com");
        usuarioRaiting.setPassword("1234");

        usuarioService.create(usuarioRaiting);

        //USUARIO3
        UsuarioDTO usuario3 = new UsuarioDTO();
        usuario3.setNombre("UsuarioMedia");
        usuario3.setApellidos("De Prueba");
        usuario3.setEmail("prueba3@gmail.com");
        usuario3.setPassword("1234");

        usuarioService.create(usuario3);
    }

    // TEST 8 - CREAR VALORACION

    @Test
    @DisplayName("TEST POSITIVO 8 - CREAR VALORACION")
    void crearValoracionTest(){

        RaitingDTO raitingDTO = new RaitingDTO();
        raitingDTO.setIdPuntuado(2);
        raitingDTO.setIdPuntuador(1);
        raitingDTO.setPuntuacion(4);

        RaitingDTO creado = raitingService.save(raitingDTO);
        List<RaitingDTO> buscado = raitingService.findByPuntuadoId(2);

        assertTrue(buscado.size() > 0);
        assertEquals(creado.getPuntuacion(), buscado.get(0).getPuntuacion());
        assertEquals(creado.getIdPuntuador(), buscado.get(0).getIdPuntuador());
        assertEquals(creado.getIdPuntuado(), buscado.get(0).getIdPuntuado());

    }

    @Test
    @DisplayName("TEST POSITIVO 8 - CREAR DOS VALORACIONES Y OBTENER LA MEDIA")
    void obtenerMediaValoracionTest(){

        RaitingDTO raitingDTO1 = new RaitingDTO();
        raitingDTO1.setIdPuntuado(2);
        raitingDTO1.setIdPuntuador(1);
        raitingDTO1.setPuntuacion(4);

        raitingService.save(raitingDTO1);

        RaitingDTO raitingDTO2 = new RaitingDTO();
        raitingDTO2.setIdPuntuado(2);
        raitingDTO2.setIdPuntuador(3);
        raitingDTO2.setPuntuacion(5);

        raitingService.save(raitingDTO2);

        Double media = raitingService.obtenerMediaPuntuacionUsuario(2);

        assertEquals(4.5, media);

    }

    @Test
    @DisplayName("TEST NEGATIVO 8 - VALORACIÓN FUERA DE RANGO")
    void crearValoracionFueraDeRangoTest(){

        RaitingDTO raitingDTO = new RaitingDTO();
        raitingDTO.setIdPuntuado(2);
        raitingDTO.setIdPuntuador(1);
        raitingDTO.setPuntuacion(6); // Fuera de rango

        assertThrows(ResponseStatusException.class, () -> raitingService.save(raitingDTO));

    }

    @Test
    @DisplayName("TEST NEGATIVO 8 - CREAR VALORACION USUARIO A SI MISMO")
    void crearValoracionUsuarioASiMismoTest(){

        RaitingDTO raitingDTO = new RaitingDTO();
        raitingDTO.setIdPuntuado(2);
        raitingDTO.setIdPuntuador(2); // Mismo usuario
        raitingDTO.setPuntuacion(4);

        assertThrows(ResponseStatusException.class, () -> raitingService.save(raitingDTO));

    }

}
