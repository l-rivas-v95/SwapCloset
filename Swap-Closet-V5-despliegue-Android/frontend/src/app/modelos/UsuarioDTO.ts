import {ProductoDTO} from "./ProductoDTO";

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
  raiting?: number

  productos?: ProductoDTO[];
}
