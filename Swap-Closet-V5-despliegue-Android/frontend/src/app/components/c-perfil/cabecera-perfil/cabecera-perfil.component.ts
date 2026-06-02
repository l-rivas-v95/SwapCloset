import {Component, effect, inject, Input, input, OnInit, signal} from '@angular/core';
import {IonicModule, ModalController, ToastController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import{RouterLink} from "@angular/router";
import {UsuarioEstadisticasDTO} from "../../../modelos/UsuarioEstadisticasDTO";
import {ModalFotosPerfilComponent} from "../modal-fotos-perfil/modal-fotos-perfil.component";
import {AuthService} from "../../../service/authService/auth.service";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";

@Component({
  selector: 'app-cabecera-perfil',
  templateUrl: './cabecera-perfil.component.html',
  styleUrls: ['./cabecera-perfil.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class CabeceraPerfilComponent{

  maxStars = 5;
  @Input() usuario = signal<UsuarioEstadisticasDTO | null>(null);

  private modalCtrl = inject(ModalController);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  constructor(private toastCtrl: ToastController) {
    effect(() => {
        const currentUsuario = this.usuario();
        if (currentUsuario) {
            console.log("Usuario data received:", currentUsuario.raiting);
        }
    });
  }

  async cambiarFoto() {
    const modal = await this.modalCtrl.create({
      component: ModalFotosPerfilComponent,
      cssClass: 'modal-galeria'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data?.ruta) return;

    const usuarioActual = this.usuario();
    if (!usuarioActual?.id) {
      const toast = await this.toastCtrl.create({
        message: 'Usuario no válido',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // 1️⃣ Actualización local
    usuarioActual.urlImg = data.ruta;

    // 2️⃣ Guardar usuario completo
    this.usuarioService.updateUsuario(usuarioActual.id, usuarioActual)
      .subscribe({
        next: async (usuarioGuardado) => {
          this.usuario.set(usuarioGuardado); // sincroniza signal

          const toast = await this.toastCtrl.create({
            message: 'Foto de perfil actualizada',
            duration: 2000,
          });
          await toast.present();
        },
        error: async () => {
          const toast = await this.toastCtrl.create({
            message: 'Error al guardar la foto',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      });
  }


}

