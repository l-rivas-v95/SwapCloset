package org.swapcloset.backend.converter;

import org.mapstruct.Named;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface DateTimeMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Named("formatDateTime")
    default String formatDateTime(LocalDateTime dt) {
        return dt == null ? null : dt.format(FORMATTER);
    }

    @Named("parseDateTime")
    default LocalDateTime parseDateTime(String dt) {
        return dt == null ? null : LocalDateTime.parse(dt, FORMATTER);
    }
}
