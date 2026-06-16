import {Component, computed, effect, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {IonicModule, ModalController, ToastController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {UsuarioEstadisticasDTO} from "../../../modelos/UsuarioEstadisticasDTO";
import {ModalFotosPerfilComponent} from "../modal-fotos-perfil/modal-fotos-perfil.component";
import {AuthService} from "../../../service/authService/auth.service";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {RaitingService} from "../../../service/raitingService/raiting.service";
import {SeguidoresService} from "../../../service/seguidoresService/seguidores.service";
import {RaitingDTO} from "../../../modelos/RaitingDTO";
import {SeguidorDTO} from "../../../modelos/SeguidorDTO";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";

@Component({
  selector: 'app-cabecera-perfil',
  templateUrl: './cabecera-perfil.component.html',
  styleUrls: ['./cabecera-perfil.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class CabeceraPerfilComponent {

  maxStars = 5;

  @Input() usuario = signal<UsuarioEstadisticasDTO | null>(null);
  @Input() esMiPerfil = true;
  @Output() usuarioActualizado = new EventEmitter<UsuarioDTO>();

  private modalCtrl = inject(ModalController);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private raitingService = inject(RaitingService);
  private seguidoresService = inject(SeguidoresService);
  private toastCtrl = inject(ToastController);

  ratingSeleccionado = signal<number>(0);
  haPuntuado = signal<boolean>(false);
  isFollowing = signal<boolean>(false);

  ratingVisual = computed(() => {
    const ratingBase = this.usuario()?.raiting ?? 0;
    return this.ratingSeleccionado() === 0 ? ratingBase : this.ratingSeleccionado();
  });

  constructor() {
    effect(() => {
      const usuarioPerfil = this.usuario();
      if (usuarioPerfil && !this.esMiPerfil) {
        this.checkInitialFollowState();
      }
    });
  }

  async cambiarFoto() {
    if (!this.esMiPerfil) return;

    const modal = await this.modalCtrl.create({
      component: ModalFotosPerfilComponent,
      cssClass: 'modal-galeria'
    });

    await modal.present();

    const {data} = await modal.onDidDismiss();
    if (!data?.ruta) return;

    const usuarioActual = this.usuario();
    if (!usuarioActual?.id) {
      await this.mostrarToast('Usuario no válido');
      return;
    }

    const usuarioActualizado: UsuarioEstadisticasDTO = {
      ...usuarioActual,
      urlImg: data.ruta
    };

    this.usuarioService.updateUsuario(usuarioActual.id, usuarioActualizado).subscribe({
      next: async (usuarioGuardado) => {
        const usuarioPerfilActualizado: UsuarioEstadisticasDTO = {
          ...usuarioActualizado,
          ...usuarioGuardado,
          urlImg: usuarioGuardado.urlImg ?? data.ruta
        };

        this.usuario.set(usuarioPerfilActualizado);
        this.usuarioActualizado.emit(usuarioGuardado);

        const usuarioSesion = this.authService.getUsuario();
        if (usuarioSesion?.id === usuarioPerfilActualizado.id) {
          this.authService.setUsuario({
            ...usuarioSesion,
            ...usuarioGuardado,
            urlImg: usuarioPerfilActualizado.urlImg
          });
        }

        await this.mostrarToast('Foto de perfil actualizada');
      },
      error: async () => await this.mostrarToast('Error al guardar la foto')
    });
  }

  setRating(valor: number) {
    if (this.esMiPerfil) return;

    if (this.haPuntuado()) {
      this.mostrarToast('Ya has valorado a este usuario anteriormente.');
      return;
    }

    this.ratingSeleccionado.set(valor);
    this.confirmarYGuardarRaiting(valor);
  }

  private confirmarYGuardarRaiting(rating: number) {
    const usuarioPuntuador = this.authService.getUsuario();
    const idPuntuado = this.usuario()?.id;

    if (!usuarioPuntuador?.id || !idPuntuado) {
      this.mostrarToast('Error de autenticación o ID de usuario faltante.');
      this.ratingSeleccionado.set(0);
      return;
    }

    const raitingParaGuardar: RaitingDTO = {
      idPuntuado,
      idPuntuador: usuarioPuntuador.id,
      puntuacion: rating
    };

    this.raitingService.guardarRaiting(raitingParaGuardar).subscribe({
      next: async () => {
        this.haPuntuado.set(true);
        await this.mostrarToast(`Has valorado con ${rating} estrellas.`);
      },
      error: async (error) => {
        const mensaje = error.status === 400 && error.error
          ? error.error
          : 'Error al guardar la valoración.';
        this.ratingSeleccionado.set(0);
        await this.mostrarToast(mensaje);
      }
    });
  }

  private checkInitialFollowState() {
    const followedId = this.usuario()?.id;
    const follower = this.authService.getUsuario();

    if (!followedId || !follower?.id || followedId === follower.id) {
      this.isFollowing.set(false);
      return;
    }

    this.seguidoresService.isFollowing(follower.id, followedId).subscribe({
      next: (isFollowing) => this.isFollowing.set(isFollowing),
      error: () => this.isFollowing.set(false)
    });
  }

  toggleFollow() {
    if (this.esMiPerfil) return;

    const followedId = this.usuario()?.id;
    const follower = this.authService.getUsuario();

    if (!follower?.id || !followedId) {
      this.mostrarToast('Debes iniciar sesión para seguir a un usuario.');
      return;
    }

    if (this.isFollowing()) {
      this.seguidoresService.deleteSeguidor(follower.id, followedId).subscribe({
        next: async () => {
          this.isFollowing.set(false);
          await this.mostrarToast('Has dejado de seguir a este usuario.');
        },
        error: async () => await this.mostrarToast('Error al dejar de seguir.')
      });
    } else {
      const followDto: SeguidorDTO = {
        idSeguidor: follower.id,
        idSeguido: followedId
      };

      this.seguidoresService.saveSeguidor(followDto).subscribe({
        next: async () => {
          this.isFollowing.set(true);
          await this.mostrarToast('Ahora sigues a este usuario.');
        },
        error: async () => await this.mostrarToast('Error al seguir al usuario.')
      });
    }
  }

  private async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  protected readonly Math = Math;
}
