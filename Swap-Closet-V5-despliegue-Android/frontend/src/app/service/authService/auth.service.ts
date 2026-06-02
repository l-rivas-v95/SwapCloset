import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActualSubject = new BehaviorSubject<UsuarioDTO | null>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor() { }


  setUsuario(usuario: UsuarioDTO) {
    this.usuarioActualSubject.next(usuario);
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  }

  getUsuario(): UsuarioDTO | null {
    return this.usuarioActualSubject.value;
  }

  cargarUsuarioSesion() {
    const usuario = localStorage.getItem('usuarioActual');
    if (usuario) {
      this.usuarioActualSubject.next(JSON.parse(usuario));
    }
  }

  logout() {
    this.usuarioActualSubject.next(null);
    localStorage.removeItem('usuarioActual');
  }
}
