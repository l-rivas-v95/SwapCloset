export interface MensajeDTO {
  id?: number;
  idChat?: number;
  contenido?: string;
  fechaEnvio?: string;
  leido?: boolean;
  idRemitente?: number;
  tipo?: 'TEXTO' | 'PRODUCTO' | 'FECHA' | 'UBICACION' | 'FECHA_DEVOLUCION';
  aceptado?: boolean | null;
}
