export interface CartaProductoDTO {
  //Producto
  productoId: number,
  tipo: string,
  precio: string,
  titulo: string,
  estado: string,
  talla: string,
  fechaDevolucion: string,
  fechaCreacion: string,
  activo: boolean,

    //ImagenProducto
  urlImgProducto: string,

    //Usuario
  usuarioId: number,
  nombreUsuario: string,
  apellidosUsuario: string,
  urlImgUsuario: string,
  ubicacionUsuario: string,

    //Raiting
  raiting: number
}
