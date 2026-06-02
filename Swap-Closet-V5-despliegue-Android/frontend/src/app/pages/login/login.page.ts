import {booleanAttribute, Component, inject} from '@angular/core';
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
import {ToastController} from "@ionic/angular";
import {AuthService} from "../../service/authService/auth.service";

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
export class LoginPage {
  modoRegistro = false; // false = login, true = registro

  // Campos de registro
  nombre: string = '';
  apellidos: string = '';
  correo: string = '';
  password: string = '';
  password2: string = '';

  correoSign: string = '';
  passwordSign: string = '';

  private usuarioService = inject(UsuarioService);
  usuario: UsuarioDTO | undefined;

  constructor(private toastCtrl: ToastController,
              private router: Router,
              private authService: AuthService) {
  }


  toggleModo() {
    this.modoRegistro = !this.modoRegistro;
  }

  async guardarUsuario() {
    // Validar contraseñas
    if (this.password !== this.password2) {
      const toast = await this.toastCtrl.create({
        message: 'Las contraseñas no coinciden',
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    // Validar campos vacíos
    if (!this.nombre || !this.apellidos || !this.correo || !this.password) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, complete todos los campos',
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    // Validar formato del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) {
      const toast = await this.toastCtrl.create({
        message: 'Correo electrónico inválido',
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    try {
      // Verificar si el correo existe en el backend
      if (!booleanAttribute(this.usuarioService.verificarEmail(this.correo))) {
        const toast = await this.toastCtrl.create({
          message: 'El correo electrónico ya existe',
          duration: 1500,
          position: 'bottom'
        });
        await toast.present();
        this.correo = ""
        return;
      }
    } catch (err) {
      console.error('Error al verificar el email', err);
      const toast = await this.toastCtrl.create({
        message: 'Error al verificar el correo electrónico',
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
      this.correo = ""
      return;
    }

    // Preparar DTO
    this.usuario = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.correo,
      password: this.password,
      urlImg: "assets/icon/img-perfil-circular-pref.png"
    } as UsuarioDTO;

    // Enviar al backend
    this.usuarioService.guardarUsuario(this.usuario).subscribe({
      next: async (res) => {
        console.log('Usuario guardado:', res);
        // Guardar usuario como "actual"
        this.authService.setUsuario(res);

        const toast = await this.toastCtrl.create({
          message: 'Usuario registrado correctamente',
          duration: 1500,
          position: 'bottom'
        });
        await toast.present();
        // Limpiar formulario
        this.nombre = '';
        this.apellidos = '';
        this.correo = '';
        this.password = '';

        await this.router.navigate(['/perfil', res]);
      },
      error: async (err) => {
        console.error('Error al guardar usuario', err);
        const toast = await this.toastCtrl.create({
          message: 'Error al registrar usuario',
          duration: 1500,
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  // Metodo de login (ejemplo simple)
  async login() {
    if (!this.correoSign || !this.passwordSign) {
      const toast = await this.toastCtrl.create({
        message: 'Completa correo y contraseña',
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    this.usuarioService.loginUsuario(this.correoSign, this.passwordSign)
      .subscribe({
        next: async (res) => {
          console.log('Usuario logueado:', res);
          this.authService.setUsuario(res); // Guardar usuario actual
          await this.router.navigate(['/home']); // Redirigir
        },
        error: async (err) => {
          console.error('Error login', err);
          const toast = await this.toastCtrl.create({
            message: 'Correo o contraseña incorrectos',
            duration: 1500,
            position: 'bottom'
          });
          await toast.present();
        }
      });
  }
}
