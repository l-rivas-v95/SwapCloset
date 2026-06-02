package org.swapcloset.backend.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.swapcloset.backend.dto.ChatDTO;
import org.swapcloset.backend.modelos.Chat;
import org.swapcloset.backend.modelos.TipoEstadoIntercambio;
import org.swapcloset.backend.modelos.TipoProducto;


import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ChatMapper {
    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Mapping(source = "fechaCreacion", target = "fechaCreacion", qualifiedByName = "formatDateTime")
    @Mapping(source = "fechaQuedada", target = "fechaQuedada", qualifiedByName = "formatDateTime")
    @Mapping(source = "fechaDevolucion", target = "fechaDevolucion", qualifiedByName = "formatDateTime")
    ChatDTO toDTO(Chat chat);

    @Mapping(source = "fechaCreacion", target = "fechaCreacion", qualifiedByName = "parseDateTime")
    @Mapping(source = "fechaQuedada", target = "fechaQuedada", qualifiedByName = "parseDateTime")
    @Mapping(source = "fechaDevolucion", target = "fechaDevolucion", qualifiedByName = "parseDateTime")
    Chat toEntity(ChatDTO chatDTO);

    @Named("formatDateTime")
    default String formatDateTime(LocalDateTime dt) {
        return dt == null ? null : dt.format(FORMATTER); // -> 2020-12-03T18:00:00
    }

    @Named("parseDateTime")
    default LocalDateTime parseDateTime(String dt) {
        return dt == null ? null : LocalDateTime.parse(dt, FORMATTER);
    }


}
