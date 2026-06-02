package org.swapcloset.backend.converter;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.swapcloset.backend.dto.UsuarioEstadisticaDTO;
import org.swapcloset.backend.modelos.Seguidor;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.ProductoRepository;
import org.swapcloset.backend.repository.SeguidorRepository;
import org.swapcloset.backend.service.ChatService;
import org.swapcloset.backend.service.FavoritoService;
import org.swapcloset.backend.service.RaitingService;
import org.swapcloset.backend.service.SeguidorService;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioEstadisticaMapper {

    @Mapping(target = "raiting", expression = "java(raitingService.obtenerMediaPuntuacionUsuario(usuario.getId()))")
    @Mapping(target = "publicaciones", expression = "java(productoRepository.countByUsuarioId(usuario.getId()))")
    @Mapping(target = "intercambios", expression = "java(chatService.getCantidadTotalIntercambios(usuario.getId()))")
    @Mapping(target = "seguidores", expression = "java(seguidorService.getTotalSeguidores(usuario.getId()))")
    @Mapping(target = "favoritos", expression = "java(favoritosService.findCountFavoritosByUsuarioId(usuario.getId()))")
    UsuarioEstadisticaDTO toDTO(Usuario usuario, @Context RaitingService raitingService, @Context ProductoRepository productoRepository, @Context ChatService chatService, @Context SeguidorService seguidorService, @Context FavoritoService favoritosService);

}

