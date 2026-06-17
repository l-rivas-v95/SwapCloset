package org.swapcloset.backend.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.swapcloset.backend.dto.MensajeDTO;
import org.swapcloset.backend.modelos.Mensaje;

import java.util.List;

@Mapper(componentModel = "spring", uses = {DateTimeMapper.class})
public interface MensajeMapper {

    @Mapping(source = "chat.id", target = "idChat")
    @Mapping(source = "fechaEnvio", target = "fechaEnvio", qualifiedByName = "formatDateTime")
    MensajeDTO toDTO(Mensaje entidad);

    @Mapping(target = "chat", ignore = true)
    @Mapping(source = "fechaEnvio", target = "fechaEnvio", qualifiedByName = "parseDateTime")
    Mensaje toEntity(MensajeDTO dto);

    List<MensajeDTO> toDTOList(List<Mensaje> entidades);

    List<Mensaje> toEntityList(List<MensajeDTO> dtos);
}