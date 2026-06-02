import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {RaitingDTO} from "../../modelos/RaitingDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RaitingService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/raitings';

  getRaiting(id: number): Observable<RaitingDTO> {
    return this.http.get<RaitingDTO>(`${this.apiUrl}/${id}`)
  }

  getMediaRaitingByUsuario(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuario/${idUsuario}/media`);
  }

  guardarRaiting(raiting: RaitingDTO): Observable<RaitingDTO> {
    return this.http.post<RaitingDTO>(`${this.apiUrl}/create`, raiting);
  }
}
