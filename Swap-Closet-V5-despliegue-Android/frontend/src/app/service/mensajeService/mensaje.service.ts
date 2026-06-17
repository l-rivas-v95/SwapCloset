import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MensajeDTO} from "../../modelos/MensajeDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/mensajes';

  getMensaje(id: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.apiUrl}/${id}`);
  }

  getMensajesByChat(chatId: number): Observable<MensajeDTO[]> {
    return this.http.get<MensajeDTO[]>(`${this.apiUrl}/chat/${chatId}`);
  }

  enviar(mensaje: MensajeDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.apiUrl, mensaje);
  }

  responderPropuesta(mensajeId: number, aceptado: boolean): Observable<MensajeDTO> {
    return this.http.patch<MensajeDTO>(
      `${this.apiUrl}/${mensajeId}/responder?aceptado=${aceptado}`,
      {}
    );
  }

  actualizar(id: number, mensaje: MensajeDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.apiUrl}/${id}`, mensaje);
  }

  marcarLeidos(chatId: number, usuarioId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/chat/${chatId}/leer?usuarioId=${usuarioId}`,
      {}
    );
  }
}
