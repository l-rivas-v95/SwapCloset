package org.swapcloset.backend.converter;

import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import org.swapcloset.backend.dto.ImagenProductoDTO;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.modelos.ImagenProducto;
import org.swapcloset.backend.modelos.Producto;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImagenProductoMapper {

    @Mapping(target = "idProducto", source = "producto.id")
    ImagenProductoDTO toDTO(ImagenProducto imagenProducto);

    ImagenProducto toEntity(ImagenProductoDTO imagenProductoDTO);

    List<ImagenProductoDTO> toDTOsList(List<ImagenProducto> imagenes);

    List<ImagenProducto> toEntitysList(List<ImagenProductoDTO> imagenProductoDTOS);

}