import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonCheckbox
} from '@ionic/angular/standalone';
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {AuthService} from "../../service/authService/auth.service";
import {NativeToastService} from "../../service/nativeToastService/native-toast.service";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule,
    RouterLink,

    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonCheckbox
  ]
})
export class LoginPage implements OnInit {
  modoRegistro = false;

  // Campos de registro
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  password: string = '';
  password2: string = '';

  correoSign: string = '';
  passwordSign: string = '';
  recordar: boolean = false;

  private usuarioService = inject(UsuarioService);
  usuario: UsuarioDTO | undefined;

  private toast = inject(NativeToastService);

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    const saved = localStorage.getItem('sc_recordar');
    if (saved) {
      const { email } = JSON.parse(saved);
      this.correoSign = email ?? '';
      this.recordar   = true;
    }
  }


  toggleModo() {
    this.modoRegistro = !this.modoRegistro;
  }

  async guardarUsuario() {
    if (this.password !== this.password2) { this.toast.show('Las contraseñas no coinciden'); return; }
    if (!this.nombre || !this.apellidos || !this.correo || !this.password) { this.toast.show('Por favor, complete todos los campos'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) { this.toast.show('Correo electrónico inválido'); return; }

    this.usuarioService.verificarEmail(this.correo).subscribe({
      next: (existe) => {
        if (existe) {
          this.toast.show('El correo electrónico ya está registrado');
          this.correo = '';
          return;
        }
        const usuario: UsuarioDTO = {
          nombre: this.nombre,
          apellidos: this.apellidos,
          email: this.correo,
          password: this.password,
          urlImg: 'assets/icon/img-perfil-circular-pref.png'
        } as UsuarioDTO;

        this.usuarioService.guardarUsuario(usuario).subscribe({
          next: async (res) => {
            this.authService.setUsuario(res);
            this.nombre = ''; this.apellidos = ''; this.correo = ''; this.password = '';
            this.toast.show('Usuario registrado correctamente');
            await this.router.navigate(['/perfil', res]);
          },
          error: () => this.toast.show('Error al registrar usuario')
        });
      },
      error: () => this.toast.show('Error al verificar el correo electrónico')
    });
  }

  async login() {
    if (!this.correoSign || !this.passwordSign) { this.toast.show('Completa correo y contraseña'); return; }

    this.usuarioService.loginUsuario(this.correoSign, this.passwordSign).subscribe({
      next: async (res) => {
        if (this.recordar) {
          localStorage.setItem('sc_recordar', JSON.stringify({ email: this.correoSign }));
        } else {
          localStorage.removeItem('sc_recordar');
        }
        this.authService.setUsuario(res);
        await this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error login', err);
        this.toast.show('Correo o contraseña incorrectos');
      }
    });
  }
}
