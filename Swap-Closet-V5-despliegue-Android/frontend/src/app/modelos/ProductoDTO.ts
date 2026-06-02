import {ImagenProductoDTO} from "./ImagenProductoDTO";
import {UsuarioDTO} from "./UsuarioDTO";
import {FavoritosService} from "../service/favoritosService/favoritos.service";
import {FavoritoDTO} from "./FavoritoDTO";
import {ChatDTO} from "./ChatDTO";

export interface ProductoDTO {

  id?: number;
  tipo?: string;
  precio?: string;
  titulo?: string;
  estilo?: string;
  descripcion?: string;
  marca?: string;
  estado?: string;
  categoria?: string;
  talla?: string;
  color?: string;
  fechaDevolucion?: string;
  fechaCreacion?: string;
  idUsuario?: number;
  activo?: boolean;

  //usuario?: UsuarioDTO;
  imagenes?: ImagenProductoDTO[];
  favoritos?: FavoritoDTO[];
  chatProducto1?: ChatDTO[];
  chatsProducto2?: ChatDTO[];
}
