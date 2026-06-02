package org.swapcloset.backend.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.swapcloset.backend.modelos.TipoProducto;

import java.util.Locale;

@Converter(autoApply = true)
public class TipoProductoConverter implements AttributeConverter<TipoProducto, String> {

    @Override
    public String convertToDatabaseColumn(TipoProducto attribute) {
        if (attribute == null) return null;
        // Guardar en BD en minúsculas consistentes
        return attribute.name().toLowerCase(Locale.ROOT);
    }

    @Override
    public TipoProducto convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        String trimmed = dbData.trim();

        // Intentar varios formatos (exacto, minúsculas, mayúsculas)
        try { return TipoProducto.valueOf(trimmed); } catch (IllegalArgumentException ignored) {}
        try { return TipoProducto.valueOf(trimmed.toLowerCase(Locale.ROOT)); } catch (IllegalArgumentException ignored) {}
        try { return TipoProducto.valueOf(trimmed.toUpperCase(Locale.ROOT)); } catch (IllegalArgumentException ignored) {}

        // Mapeo explícito por sinónimos / variantes (por si en BD hay "préstamo" con tilde, etc.)
        String normalized = trimmed.toLowerCase(Locale.ROOT);
        if ("intercambio".equals(normalized)) return TipoProducto.intercambio;
        if ("prestamo".equals(normalized) || "préstamo".equals(normalized)) return TipoProducto.prestamo;

        throw new IllegalArgumentException("Valor de TipoProducto en BD desconocido: " + dbData);
    }
}