package org.swapcloset.backend.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.swapcloset.backend.dto.MensajeDTO;
import org.swapcloset.backend.modelos.Mensaje;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MensajeMapper {
    @Mapping(target = "fechaEnvio", source = "fechaEnvio", dateFormat = "dd/MM/yy")
    MensajeDTO toDTO(Mensaje entidad);

    Mensaje toEntity(MensajeDTO dto);

    List<MensajeDTO> toDTOList(List<Mensaje> entidades);

    List<Mensaje> toEntityList(List<MensajeDTO> dtos);
}