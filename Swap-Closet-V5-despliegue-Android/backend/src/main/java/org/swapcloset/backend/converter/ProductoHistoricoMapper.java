package org.swapcloset.backend.converter;

import org.mapstruct.*;
import org.swapcloset.backend.dto.ProductoHistoricoDTO;
import org.swapcloset.backend.modelos.ProductoHistorico;
import org.swapcloset.backend.modelos.Usuario;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductoHistoricoMapper {

    @Mapping(target = "fechaDevolucion", source = "fechaDevolucion", dateFormat = "dd/MM/yy")
    @Mapping(target = "fechaCreacion", source = "fechaCreacion", dateFormat = "dd/MM")
    ProductoHistoricoDTO toDTO(ProductoHistorico productoHistorico);

    ProductoHistorico toEntity(ProductoHistoricoDTO productoHistoricoDTO);

    List<ProductoHistoricoDTO> toDTOsList(List<ProductoHistorico> productoHistorico);

    List<ProductoHistorico> toEntitysList(List<ProductoHistoricoDTO> productoHistoricoDTO);

    void updateEntityFromDTO(ProductoHistoricoDTO dto, @MappingTarget ProductoHistorico entidad);

    @Named("usuarioFromId")
    default Usuario usuarioFromId(Integer id) {
        if (id == null) {
            return null;
        }
        Usuario u = new Usuario();
        u.setId(id);
        return u;
    }
}
