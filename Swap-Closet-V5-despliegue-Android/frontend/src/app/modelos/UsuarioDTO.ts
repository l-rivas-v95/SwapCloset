import {RaitingDTO} from "./RaitingDTO";
import {ProductoDTO} from "./ProductoDTO";
import {ChatDTO} from "./ChatDTO";

export interface UsuarioDTO {

  id?: number
  nombre?: string
  apellidos?: string
  email?: string
  password?: string
  descripcion?: string
  estilo?: string
  urlImg?: string
  direccion?: string
  tCamiseta?: string
  tPantalon?: number
  tCalzado?: number

  productos?: ProductoDTO[];
}
