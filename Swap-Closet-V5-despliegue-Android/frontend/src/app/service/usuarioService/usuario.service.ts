import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {LoginDTO} from "../../modelos/LoginDTO";
import {UsuarioEstadisticasDTO} from "../../modelos/UsuarioEstadisticasDTO";
import {CartaUsuarioDTO} from "../../modelos/CartaUsuarioDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/usuarios';

  getUsuario(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/${id}`)
  }
  guardarUsuario(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.apiUrl}/${id}`, usuario);
  }

  subirFotoPerfil(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/guardar-foto`, formData);
  }

  verificarEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/email/${email}`);
  }

  loginUsuario(email: string, password: string): Observable<LoginDTO> {
    return this.http.post<LoginDTO>(`${this.apiUrl}/login`, { email, password });
  }

  getUsuarioEstadisticas(id: number): Observable<UsuarioEstadisticasDTO> {
    return this.http.get<UsuarioEstadisticasDTO>(`${this.apiUrl}/estadisticas/${id}`);
  }

  getUsuariosEstadisticasTodos(): Observable<UsuarioEstadisticasDTO[]> {
    return this.http.get<UsuarioEstadisticasDTO[]>(`${this.apiUrl}/estadisticas-all`);
  }

  getCartaUsuarios(isUsuario: number): Observable<CartaUsuarioDTO> {
    return this.http.get<CartaUsuarioDTO>(`${this.apiUrl}/carta-usuario/${isUsuario}`);
  }

}
