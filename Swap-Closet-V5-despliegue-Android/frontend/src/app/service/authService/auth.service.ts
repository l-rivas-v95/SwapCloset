import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActualSubject = new BehaviorSubject<UsuarioDTO | null>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  private token: string | null = null;

  constructor() { }

  setUsuario(usuario: UsuarioDTO) {
    this.usuarioActualSubject.next(usuario);
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  }

  setToken(token: string) {
    this.token = token;
    sessionStorage.setItem('sc_token', token);
  }

  getToken(): string | null {
    if (this.token) return this.token;
    const stored = sessionStorage.getItem('sc_token');
    if (stored) this.token = stored;
    return this.token;
  }

  getUsuario(): UsuarioDTO | null {
    return this.usuarioActualSubject.value;
  }

  cargarUsuarioSesion() {
    const usuario = localStorage.getItem('usuarioActual');
    if (usuario) {
      this.usuarioActualSubject.next(JSON.parse(usuario));
    }
    const token = sessionStorage.getItem('sc_token');
    if (token) this.token = token;
  }

  logout() {
    this.usuarioActualSubject.next(null);
    this.token = null;
    localStorage.removeItem('usuarioActual');
    sessionStorage.removeItem('sc_token');
  }
}
