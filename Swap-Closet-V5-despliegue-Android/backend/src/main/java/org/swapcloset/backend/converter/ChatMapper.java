package org.swapcloset.backend.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.swapcloset.backend.dto.ChatDTO;
import org.swapcloset.backend.modelos.Chat;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MensajeMapper.class, DateTimeMapper.class})
public interface ChatMapper {

    @Mapping(source = "usuario1.id", target = "usuario1Id")
    @Mapping(source = "usuario2.id", target = "usuario2Id")
    @Mapping(source = "producto1.id", target = "producto1Id")
    @Mapping(source = "producto2.id", target = "producto2Id")
    @Mapping(source = "estadoIntercambio", target = "estadoIntercambio")
    @Mapping(source = "fechaCreacion", target = "fechaCreacion", qualifiedByName = "formatDateTime")
    @Mapping(source = "fechaQuedada", target = "fechaQuedada", qualifiedByName = "formatDateTime")
    @Mapping(source = "fechaDevolucion", target = "fechaDevolucion", qualifiedByName = "formatDateTime")
    ChatDTO toDTO(Chat chat);

    @Mapping(target = "usuario1", ignore = true)
    @Mapping(target = "usuario2", ignore = true)
    @Mapping(target = "producto1", ignore = true)
    @Mapping(target = "producto2", ignore = true)
    @Mapping(target = "mensajes", ignore = true)
    @Mapping(source = "fechaCreacion", target = "fechaCreacion", qualifiedByName = "parseDateTime")
    @Mapping(source = "fechaQuedada", target = "fechaQuedada", qualifiedByName = "parseDateTime")
    @Mapping(source = "fechaDevolucion", target = "fechaDevolucion", qualifiedByName = "parseDateTime")
    Chat toEntity(ChatDTO chatDTO);
}
