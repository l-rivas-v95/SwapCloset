
export interface UsuarioEstadisticasDTO{
  id?: number,
  nombre?: string,
  apellidos?: string,
  email?: string,
  descripcion?: string,
  estilo?: string,
  urlImg?: string,
  direccion?: string,
  tCamiseta?: string,
  tPantalon?: number,
  tCalzado?: number,

  raiting?: number,
  publicaciones?: number,
  intercambios?: number,
  seguidores?: number
  favoritos?: number
}
