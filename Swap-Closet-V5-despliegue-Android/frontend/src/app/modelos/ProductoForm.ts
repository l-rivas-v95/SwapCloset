import {ImagenProductoDTO} from "./ImagenProductoDTO";

export interface ProductoForm {

  tipoOferta: 'intercambio' | 'prestamo';
  precio?: number | null;
  titulo?: string;
  estilo?: string;
  descripcion?: string;
  marca?: string;
  estado?: string;
  categoria?: string;
  talla?: string;
  color?: string;
  fechaDevolucion?: string;

  imagenes?: ImagenProductoDTO[];
}
