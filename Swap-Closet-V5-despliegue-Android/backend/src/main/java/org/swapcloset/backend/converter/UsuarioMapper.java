package org.swapcloset.backend.converter;

import org.mapstruct.*;
import org.swapcloset.backend.dto.UsuarioDTO;
import org.swapcloset.backend.modelos.Usuario;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {


    @Mapping(target = "productos", ignore = true)
    @Mapping(target = "password", ignore = true)
    UsuarioDTO toDTO(Usuario usuario);

    @Mapping(target = "productos", ignore = true)
    Usuario toEntity(UsuarioDTO usuarioDTO);

    List<UsuarioDTO> toDTOsList(List<Usuario> usuarios);

    List<Usuario> toEntitysList(List<UsuarioDTO> usuarioDTOS);

    /**
     * Actualiza la entidad existente con los campos no nulos del DTO.
     * No modifica colecciones/relaciones.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "productos")


    void updateEntityFromDTO(UsuarioDTO dto, @MappingTarget Usuario entidad);
}
