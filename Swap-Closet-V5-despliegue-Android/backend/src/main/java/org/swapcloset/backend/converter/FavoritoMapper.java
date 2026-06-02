package org.swapcloset.backend.converter;

import org.mapstruct.*;
import org.swapcloset.backend.dto.FavoritoDTO;
import org.swapcloset.backend.modelos.Favorito;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FavoritoMapper {

    @Mapping(source = "id.idUsuario", target = "idUsuario")
    @Mapping(source = "id.idProducto", target = "idProducto")
    FavoritoDTO toDTO(Favorito favorito);

    @Mapping(source = "idUsuario", target = "id.idUsuario")
    @Mapping(source = "idProducto", target = "id.idProducto")
    Favorito toEntity(FavoritoDTO favoritoDTO);

    List<FavoritoDTO> toDTOsList(List<Favorito> favoritos);

    List<Favorito> toEntitysList(List<FavoritoDTO> favoritoDTOS);

    void updateEntityFromDTO(FavoritoDTO dto, @MappingTarget Favorito entity);
}
