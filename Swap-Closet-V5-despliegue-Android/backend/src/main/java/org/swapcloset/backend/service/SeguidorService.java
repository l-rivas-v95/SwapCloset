package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.swapcloset.backend.converter.FavoritoMapper;
import org.swapcloset.backend.converter.ProductoMapper;
import org.swapcloset.backend.converter.SeguidorMapper;
import org.swapcloset.backend.converter.UsuarioMapper;
import org.swapcloset.backend.dto.SeguidorDTO;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.modelos.Seguidor;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.FavoritoRepository;
import org.swapcloset.backend.repository.ProductoRepository;
import org.swapcloset.backend.repository.SeguidorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeguidorService {

    private final SeguidorRepository seguidorRepository;
    private final UsuarioMapper usuarioMapper;
    private final SeguidorMapper seguidorMapper;

    @PersistenceContext
    private final EntityManager em;

    @Transactional(readOnly = true)
    public Integer getTotalSeguidores(Integer usuarioId) {
        Double count = seguidorRepository.getTotalSeguidores(usuarioId);
        return count != null ? count.intValue() : 0;
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findSeguidoresByUsuarioId(Integer usuarioId) {
        return seguidorRepository.findSeguidoresByUsuarioId(usuarioId).stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findSeguidosByUsuarioId(Integer usuarioId) {
        return seguidorRepository.findSeguidosByUsuarioId(usuarioId).stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SeguidorDTO save(SeguidorDTO dto) {

        Seguidor entity = seguidorMapper.toEntity(dto);
        Usuario seguido = em.getReference(Usuario.class, dto.getIdSeguido());
        Usuario seguidor = em.getReference(Usuario.class, dto.getIdSeguidor());
        entity.setSeguido(seguido);
        entity.setSeguidor(seguidor);

        Seguidor saved = seguidorRepository.save(entity);
        return seguidorMapper.toDTO(saved);
    }


    @Transactional
    public void delete(Integer idSeguidor, Integer idSeguido) {
        seguidorRepository.deleteBySeguidorIdAndSeguidoId(idSeguidor, idSeguido);
    }

    @Transactional
    public boolean isFollowing(Integer idSeguidor, Integer idSeguido) {
        return seguidorRepository.existsBySeguidorIdAndSeguidoId(idSeguidor, idSeguido);
    }


}