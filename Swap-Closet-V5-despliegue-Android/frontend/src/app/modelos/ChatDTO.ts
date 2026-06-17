import {MensajeDTO} from "./MensajeDTO";

export interface ChatDTO {
  id?: number;
  usuario1Id?: number;
  usuario2Id?: number;
  producto1Id?: number;
  producto2Id?: number;
  fechaCreacion?: string;
  fechaQuedada?: string;
  fechaDevolucion?: string;
  activo?: boolean;
  ubicacion?: string;
  completado?: boolean;
  confirmado1?: boolean;
  confirmado2?: boolean;
  estadoIntercambio?: string;
  mensajes?: MensajeDTO[];
  mensajesNoLeidos?: number;
  fechaUltimoMensaje?: string;
}
