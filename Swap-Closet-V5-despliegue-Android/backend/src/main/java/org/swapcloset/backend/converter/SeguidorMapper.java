package org.swapcloset.backend.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.swapcloset.backend.dto.SeguidorDTO;
import org.swapcloset.backend.modelos.Seguidor;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SeguidorMapper {

    @Mapping(source = "id.idSeguidor", target = "idSeguidor")
    @Mapping(source = "id.idSeguido", target = "idSeguido")
    SeguidorDTO toDTO(Seguidor seguidor);

    @Mapping(source = "idSeguidor", target = "id.idSeguidor")
    @Mapping(source = "idSeguido", target = "id.idSeguido")
    Seguidor toEntity(SeguidorDTO seguidorDTO);

    List<SeguidorDTO> toDTOsList(List<Seguidor> seguidores);

    List<Seguidor> toEntitysList(List<SeguidorDTO> SeguidorDTO);

    void updateEntityFromDTO(SeguidorDTO dto, @MappingTarget Seguidor entity);
}
