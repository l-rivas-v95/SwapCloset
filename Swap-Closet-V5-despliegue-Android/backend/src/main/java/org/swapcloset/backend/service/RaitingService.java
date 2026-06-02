package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.converter.RaitingMapper;
import org.swapcloset.backend.dto.RaitingDTO;
import org.swapcloset.backend.modelos.Raiting;
import org.swapcloset.backend.modelos.RaitingId;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.RaitingRepository;
import org.swapcloset.backend.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RaitingService {

    private final RaitingRepository raitingRepository;
    private final RaitingMapper raitingMapper;
    private final UsuarioRepository usuarioRepository;

    @PersistenceContext
    private final EntityManager em;


    @Transactional(readOnly = true)
    public List<RaitingDTO> findAll() {
        return raitingRepository.findAll().stream()
                .map(raitingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double obtenerMediaPuntuacionUsuario(Integer idUsuario) {
        Double media = raitingRepository.findAveragePuntuacionByPuntuadoId(idUsuario);

        if(media == null) {
            return 0.0;
        }

        // Redondear a 0.5 más cercano
        return Math.round(media * 2) / 2.0;
    }

    @Transactional(readOnly = true)
    public Optional<RaitingDTO> findById(RaitingId id) {
        return raitingRepository.findById(id).map(raitingMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<RaitingDTO> findByPuntuadoId(Integer idPuntuado) {
        return raitingRepository.findByPuntuado_Id(idPuntuado).stream()
                .map(raitingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RaitingDTO> findByPuntuadorId(Integer idPuntuador) {
        return raitingRepository.findByPuntuador_Id(idPuntuador).stream()
                .map(raitingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RaitingDTO save(RaitingDTO dto) {

        // 1. Verificación de existencia de usuarios
        if (!usuarioRepository.existsById(dto.getIdPuntuado())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Usuario puntuado no encontrado con ID: " + dto.getIdPuntuado());
        }
        if (!usuarioRepository.existsById(dto.getIdPuntuador())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Usuario puntuador no encontrado con ID: " + dto.getIdPuntuador());
        }

        if(dto.getPuntuacion()>5 || dto.getPuntuacion()<0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La puntuación debe estar entre 0 y 5");
        }

        if(dto.getIdPuntuado() == dto.getIdPuntuador()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Un usuario no puede puntuarse a sí mismo");
        }

        Raiting entity = new Raiting();
        entity.setId(new RaitingId(dto.getIdPuntuado(), dto.getIdPuntuador()));

        Usuario puntuadoRef = em.getReference(Usuario.class, dto.getIdPuntuado());
        Usuario puntuadorRef = em.getReference(Usuario.class, dto.getIdPuntuador());

        entity.setPuntuado(puntuadoRef);
        entity.setPuntuador(puntuadorRef);

        entity.setPuntuacion(dto.getPuntuacion());

        Raiting saved = raitingRepository.save(entity);

        return raitingMapper.toDTO(saved);
    }


    @Transactional
    public RaitingDTO update(RaitingDTO dto) {
        if (dto == null || dto.getIdPuntuado() == null || dto.getIdPuntuador() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Los ids del raiting no deben ser null");
        }
        RaitingId id = new RaitingId(dto.getIdPuntuado(), dto.getIdPuntuador());


        Raiting existente = raitingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No existe Raiting con ID compuesto: Puntuado=" + dto.getIdPuntuado() + ", Puntuador=" + dto.getIdPuntuador()));

        if (!usuarioRepository.existsById(dto.getIdPuntuado())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Usuario puntuado no encontrado con ID: " + dto.getIdPuntuado());
        }
        if (!usuarioRepository.existsById(dto.getIdPuntuador())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Usuario puntuador no encontrado con ID: " + dto.getIdPuntuador());
        }

        raitingMapper.updateEntityFromDTO(dto, existente);

        existente.setPuntuado(em.getReference(Usuario.class, dto.getIdPuntuado()));
        existente.setPuntuador(em.getReference(Usuario.class, dto.getIdPuntuador()));

        Raiting updated = raitingRepository.save(existente);
        return raitingMapper.toDTO(updated);
    }

    @Transactional
    public void deleteById(RaitingId id) {
        if (id == null) return;
        raitingRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsById(RaitingId id) {
        return id != null && raitingRepository.existsById(id);
    }

}
