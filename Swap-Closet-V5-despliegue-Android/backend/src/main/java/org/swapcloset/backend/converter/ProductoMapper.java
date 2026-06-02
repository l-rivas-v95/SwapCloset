package org.swapcloset.backend.converter;

import org.mapstruct.*;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.modelos.Producto;
import org.swapcloset.backend.modelos.TipoProducto;
import org.swapcloset.backend.modelos.Usuario;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    //@Mapping(target = "fechaDevolucion", source = "fechaDevolucion", dateFormat = "dd/MM/yy")
    //@Mapping(target = "fechaCreacion", source = "fechaCreacion", dateFormat = "dd/MM/yy")
    @Mapping(target = "precio", source = "precio", qualifiedByName = "convertBigDecimalToString")
    @Mapping(target = "tipo", source = "tipo", qualifiedByName = "tipoProductoToString")
    @Mapping(target = "idUsuario", source = "usuario.id")
    ProductoDTO toDTO(Producto producto);

    @Mapping(target = "fechaDevolucion", source = "fechaDevolucion", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "fechaCreacion", source = "fechaCreacion", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "precio", source = "precio", qualifiedByName = "convertStringToBigDecimal")
    @Mapping(target = "tipo", source = "tipo", qualifiedByName = "stringToTipoProducto")
    @Mapping(target = "usuario.id", source = "idUsuario")
    Producto toEntity(ProductoDTO productoDTO);

    List<ProductoDTO> toDTOsList(List<Producto> productos);
    List<Producto> toEntitiesList(List<ProductoDTO> productoDTOS);

//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    void updateEntityFromDTO(ProductoDTO dto, @MappingTarget Producto entidad);

    @Named("tipoProductoToString")
    default String tipoProductoToString(TipoProducto tipo) {
        return tipo != null ? tipo.getTipo() : null;
    }

    @Named("stringToTipoProducto")
    default TipoProducto stringToTipoProducto(String value) {
        if (value == null) return null;

        return switch (value.toLowerCase()) {
            case "intercambio" -> TipoProducto.intercambio;
            case "préstamo", "prestamo" -> TipoProducto.prestamo;
            default -> null;
        };
    }

    @Named("convertStringToBigDecimal")
    default BigDecimal convertStringToBigDecimal(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        BigDecimal bd = new BigDecimal(value);
        // elimina decimales si son .00
        if (bd.stripTrailingZeros().scale() <= 0) {
            // es un entero, redondeamos a 0 decimales
            bd = bd.setScale(0, RoundingMode.UNNECESSARY);
        }
        return bd;
    }

    @Named("convertBigDecimalToString")
    default String convertBigDecimalToString(BigDecimal value) {
        if (value == null) {
            return null;
        }
        // eliminamos ceros a la derecha y obtenemos la representación "plana"
        return value.stripTrailingZeros().toPlainString();
    }

    @Named("stringToLocalDateTime")
    default LocalDateTime stringToLocalDateTime(String value) {
        if (value == null || value.isBlank()) return null;

        // Manejar casos: "2025-01-31" o "2025-01-31T14:00"
        if (!value.contains("T")) {
            return LocalDate.parse(value).atStartOfDay();
        }

        return LocalDateTime.parse(value);
    }

}