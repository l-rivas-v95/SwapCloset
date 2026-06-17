import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChatDTO} from "../../modelos/ChatDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/chats';

  getChat(id: number): Observable<ChatDTO> {
    return this.http.get<ChatDTO>(`${this.apiUrl}/${id}`);
  }

  getChatsByUsuario(usuarioId: number): Observable<ChatDTO[]> {
    return this.http.get<ChatDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  findOrCreate(usuario1Id: number, usuario2Id: number, producto1Id: number): Observable<ChatDTO> {
    return this.http.post<ChatDTO>(
      `${this.apiUrl}/find-or-create?usuario1Id=${usuario1Id}&usuario2Id=${usuario2Id}&producto1Id=${producto1Id}`,
      {}
    );
  }

  confirmar(chatId: number, usuarioId: number): Observable<ChatDTO> {
    return this.http.patch<ChatDTO>(
      `${this.apiUrl}/${chatId}/confirmar?usuarioId=${usuarioId}`,
      {}
    );
  }
}
