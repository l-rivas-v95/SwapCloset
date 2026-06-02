import {Component, computed, effect, inject, Input, OnInit, signal} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {Observable} from "rxjs";
import {RaitingService} from "../../service/raitingService/raiting.service";
import {FavoritosService} from "../../service/favoritosService/favoritos.service";
import {SeguidoresService} from "../../service/seguidoresService/seguidores.service";
import {UsuarioEstadisticasDTO} from "../../modelos/UsuarioEstadisticasDTO";
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {RaitingDTO} from "../../modelos/RaitingDTO";
import {AuthService} from "../../service/authService/auth.service";
import {SeguidorDTO} from "../../modelos/SeguidorDTO";

@Component({
    selector: 'app-cabecera-perfil',
    templateUrl: './cabecera-perfil.component.html',
    styleUrls: ['./cabecera-perfil.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    RouterLink,
    AsyncPipe
  ]
})
export class CabeceraPerfilComponent{

  @Input() usuario = signal<UsuarioEstadisticasDTO | null>(null);

  usuarioEstadisticas = signal<UsuarioEstadisticasDTO | null>(null);

  private usuarioService = inject(UsuarioService);
  private raitingService = inject(RaitingService);
  private seguidoresService = inject(SeguidoresService);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  ratingSeleccionado = signal<number>(0);
  haPuntuado = signal<boolean>(false);
  maxStars = 5;

  isFollowing = signal<boolean>(false);

  isOwnProfile = computed(() => {
    const profileId = this.usuario()?.id;
    const currentUserId = this.authService.getUsuario()?.id;
    return !!(profileId && currentUserId && profileId === currentUserId);
  });

  constructor() {
    effect(() => {
      this.cargarUsuario();
      if (!this.isOwnProfile()) {
        this.checkInitialFollowState();
      }
    });
  }


  // LÓGICA DE CARGA Y RATING
  cargarUsuario() {
    const usuarioActual = this.usuario();
    if (usuarioActual && usuarioActual.id != null) {
      const idUsuario: number = usuarioActual.id;
      this.usuarioService.getUsuarioEstadisticas(idUsuario)
        .subscribe(estadisticas => {
          this.usuarioEstadisticas.set(estadisticas);
        });
    } else {
      this.usuarioEstadisticas.set(null);
    }
  }

  ratingVisual = computed(() => {
    const u = this.usuarioEstadisticas();
    if (!u) return 0;
    const ratingBase = u.raiting ?? 0;
    return this.ratingSeleccionado() === 0 ? ratingBase : this.ratingSeleccionado();
  });

  setRating(valor: number) {
    if (this.haPuntuado()) {
      this.mostrarError('Ya has valorado a este usuario anteriormente.');
      return;
    }
    this.ratingSeleccionado.set(valor);
    this.confirmarYGuardarRaiting(valor);
  }

  confirmarYGuardarRaiting(rating: number) {
    const usuarioPuntuador = this.authService.getUsuario();
    const idPuntuado = this.usuario()?.id;

    if (!usuarioPuntuador || !usuarioPuntuador.id || !idPuntuado) {
      this.mostrarError('Error de autenticación o ID de usuario faltante.');
      this.ratingSeleccionado.set(0);
      return;
    }

    const raitingParaGuardar: RaitingDTO = {
      idPuntuado: idPuntuado,
      idPuntuador: usuarioPuntuador.id,
      puntuacion: rating,
    };

    this.raitingService.guardarRaiting(raitingParaGuardar).subscribe({
      next: (raitingCreado) => {
        this.toastVotacion(raitingCreado.puntuacion!, true);
        this.haPuntuado.set(true);
        this.cargarUsuario();
      },
      error: (error) => {
        let mensaje = 'Error al guardar la valoración.';
        if (error.status === 400 && error.error) {
          mensaje = error.error;
        }
        this.mostrarError(mensaje);
        this.ratingSeleccionado.set(0);
      }
    });
  }


  // LÓGICA DE SEGUIMIENTO
  checkInitialFollowState() {
    const followedId = this.usuario()?.id;
    const follower = this.authService.getUsuario();

    // Si ya determinamos que es el propio perfil, salimos.
    if (this.isOwnProfile() || !followedId || !follower?.id) {
      this.isFollowing.set(false);
      return;
    }

    this.seguidoresService.isFollowing(follower.id, followedId).subscribe({
      next: (isFollowing) => {
        this.isFollowing.set(isFollowing);
      },
      error: () => {
        this.isFollowing.set(false);
      }
    });
  }

  toggleFollow() {
    const followedId = this.usuario()?.id;
    const follower = this.authService.getUsuario();

    if (!follower || !follower.id) {
      this.mostrarError('Debes iniciar sesión para seguir a un usuario.');
      return;
    }

    // Si es el propio perfil, no hacemos nada (el botón está deshabilitado en HTML)
    if (this.isOwnProfile() || !followedId) {
      return;
    }

    const followerId = follower.id;
    const currentFollowState = this.isFollowing();

    if (currentFollowState) {
      // DEJAR DE SEGUIR (DELETE)
      this.seguidoresService.deleteSeguidor(followerId, followedId).subscribe({
        next: () => {
          this.isFollowing.set(false);
          this.mostrarExito('Dejaste de seguir a ' + this.usuario()?.nombre);
          this.cargarUsuario(); // Recarga para actualizar el contador
        },
        error: () => {
          this.mostrarError('Error al dejar de seguir. Inténtalo de nuevo.');
        }
      });
    } else {
      // SEGUIR (POST)
      const followDto: SeguidorDTO = {
        idSeguidor: followerId,
        idSeguido: followedId
      };

      this.seguidoresService.saveSeguidor(followDto).subscribe({
        next: () => {
          this.isFollowing.set(true);
          this.mostrarExito('Ahora sigues a ' + this.usuario()?.nombre);
          this.cargarUsuario();
        },
        error: (error) => {
          let mensaje = 'Error al seguir. Inténtalo de nuevo.';
          if (error.status === 409) {
            mensaje = 'Ya estás siguiendo a este usuario.';
          }
          this.mostrarError(mensaje);
        }
      });
    }
  }


  // MÉTODOS DE TOAST
  async toastVotacion(rating: number, esExito: boolean) {
    const u = this.usuario();
    const mensaje = esExito
      ? `¡Has votado con ${rating} ⭐ a ${u?.nombre}!`
      : `Error: ${rating}`;

    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  async mostrarExito(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top'

    });
    await toast.present();
  }


  protected readonly Math = Math;
}
