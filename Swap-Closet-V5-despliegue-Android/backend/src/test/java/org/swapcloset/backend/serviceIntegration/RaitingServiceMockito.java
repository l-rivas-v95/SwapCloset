package org.swapcloset.backend.serviceIntegration;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.swapcloset.backend.dto.RaitingDTO;
import org.swapcloset.backend.modelos.Raiting;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.*;
import org.swapcloset.backend.service.*;
import org.swapcloset.backend.converter.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
public class RaitingServiceMockito {

    @InjectMocks
    private RaitingService raitingService;
    @Mock
    private RaitingRepository raitingRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private RaitingMapper raitingMapper;
    @Mock
    private EntityManager em;

    @Test
    @DisplayName("TEST INTEGRACIÓN 9 - GUARDAR RATING")
    void guardarRaitingMockito() {

        //GIVEN
        RaitingDTO raitingDTO = new RaitingDTO();
        raitingDTO.setIdPuntuado(1);
        raitingDTO.setIdPuntuador(2);
        raitingDTO.setPuntuacion(5);

        Mockito.when(usuarioRepository.existsById(Mockito.anyInt())).thenReturn(true);
        Mockito.when(usuarioRepository.existsById(Mockito.anyInt())).thenReturn(true);

        Mockito.when(em.getReference(Usuario.class, 1)).thenReturn(new Usuario());
        Mockito.when(em.getReference(Usuario.class, 2)).thenReturn(new Usuario());

        Raiting entidad = new Raiting();
        Raiting saved = new Raiting();
        RaitingDTO savedDTO = new RaitingDTO();

        Mockito.when(raitingRepository.save(any(Raiting.class))).thenReturn(saved);
        Mockito.when(raitingMapper.toDTO(saved)).thenReturn(savedDTO);

        //WHEN
        RaitingDTO resultado = raitingService.save(raitingDTO);

        //THEN
        assertNotNull(resultado);
        assertSame(savedDTO, resultado);

        Mockito.verify(usuarioRepository).existsById(1);
        Mockito.verify(usuarioRepository).existsById(2);
        Mockito.verify(em).getReference(Usuario.class, 1);
        Mockito.verify(em).getReference(Usuario.class, 2);
        Mockito.verify(raitingRepository).save(any(Raiting.class));
        Mockito.verify(raitingMapper).toDTO(saved);

    }


}
