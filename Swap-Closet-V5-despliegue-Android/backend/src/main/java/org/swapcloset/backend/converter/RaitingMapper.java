package org.swapcloset.backend.converter;

import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import org.swapcloset.backend.dto.RaitingDTO;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.modelos.Raiting;
import org.swapcloset.backend.modelos.Usuario;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RaitingMapper {

    @Mapping(source = "id.idPuntuado", target = "idPuntuado")
    @Mapping(source = "id.idPuntuador", target = "idPuntuador")
    RaitingDTO toDTO(Raiting entity);

    @Mapping(source = "idPuntuado", target = "id.idPuntuado")
    @Mapping(source = "idPuntuador", target = "id.idPuntuador")
    Raiting toEntity(RaitingDTO dto);

    List<RaitingDTO> toDTOsList(List<Raiting> raitings);

    List<Raiting> toEntitiesList(List<RaitingDTO> raitingDTOS);

    void updateEntityFromDTO(RaitingDTO dto, @MappingTarget Raiting entidad);
}