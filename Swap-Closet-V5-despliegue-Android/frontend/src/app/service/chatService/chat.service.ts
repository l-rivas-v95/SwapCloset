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
    return this.http.get<ChatDTO>(`${this.apiUrl}/${id}`)
  }
}
