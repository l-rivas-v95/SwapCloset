import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {Observable} from "rxjs";
import {SeguidorDTO} from "../../modelos/SeguidorDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SeguidoresService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/seguidores';

  getCountSeguidores(idUsuario: number) {
    return this.http.get<number>(`${this.apiUrl}/usuario/${idUsuario}/count`);
  }

  getSeguidores(idUsuario: number) {
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}/usuario/${idUsuario}/seguidores`);
  }

  getSiguiendo(idUsuario: number) {
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}/usuario/${idUsuario}/seguidos`);
  }

  saveSeguidor(seguidorDto: SeguidorDTO): Observable<SeguidorDTO> {
    return this.http.post<SeguidorDTO>(this.apiUrl, seguidorDto);
  }

  deleteSeguidor(idSeguidor: number, idSeguido: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idSeguidor}/${idSeguido}`);
  }

  isFollowing(idSeguidor: number, idSeguido: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${idSeguidor}/${idSeguido}`);
  }


}
