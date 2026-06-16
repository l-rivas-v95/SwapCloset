import {Component, Input, OnInit, inject} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {NgClass} from "@angular/common";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {SeguidoresService} from "../../../service/seguidoresService/seguidores.service";
import {AuthService} from "../../../service/authService/auth.service";
import {SeguidorDTO} from "../../../modelos/SeguidorDTO";
import {RouterLink} from "@angular/router";
import {RaitingService} from "../../../service/raitingService/raiting.service";

@Component({
  selector: 'app-tarjeta-seguidor',
  templateUrl: './tarjeta-seguidor.component.html',
  styleUrls: ['./tarjeta-seguidor.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgClass,
    RouterLink
  ]
})
export class TarjetaSeguidorComponent implements OnInit{

  @Input() usuario: UsuarioDTO | null = null;

  private seguidoresService = inject(SeguidoresService);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private raitingService = inject(RaitingService);

  seguido: boolean = false;
  isOwnProfile: boolean = false;
  mediaRaiting: number = 0;

  ngOnInit(): void {
    this.checkInitialFollowState();
    this.cargarMediaRaiting();
  }

  cargarMediaRaiting() {
    const idUsuario = this.usuario?.id;
    if (!idUsuario) {
      this.mediaRaiting = 0;
      return;
    }

    this.raitingService.getMediaRaitingByUsuario(idUsuario).subscribe({
      next: (media) => this.mediaRaiting = media ?? 0,
      error: () => this.mediaRaiting = 0
    });
  }

  checkInitialFollowState() {
    const followedId = this.usuario?.id;
    const follower = this.authService.getUsuario();

    if (!followedId || !follower?.id) {
      this.seguido = false;
      return;
    }

    if (follower.id === followedId) {
      this.isOwnProfile = true;
      this.seguido = false;
      return;
    }

    this.seguidoresService.isFollowing(follower.id, followedId).subscribe({
      next: (isFollowing) => {
        this.seguido = isFollowing;
      },
      error: (err) => {
        console.error("Error al chequear estado de seguimiento:", err);
        this.seguido = false;
      }
    });
  }

  toggleSeguir(event?: Event) {
    event?.stopPropagation();
    const followedId = this.usuario?.id;
    const follower = this.authService.getUsuario();

    if (!follower || !follower.id) {
      this.mostrarToast('Debes iniciar sesión para realizar esta acción.', 'danger');
      return;
    }
    if (this.isOwnProfile || !followedId) {
      return;
    }

    const followerId = follower.id;

    if (this.seguido) {
      this.seguidoresService.deleteSeguidor(followerId, followedId).subscribe({
        next: () => {
          this.seguido = false;
          this.mostrarToast(`Dejaste de seguir a ${this.usuario?.nombre}`, 'success');
        },
        error: () => {
          this.mostrarToast('Error al dejar de seguir.', 'danger');
        }
      });
    } else {
      const followDto: SeguidorDTO = {
        idSeguidor: followerId,
        idSeguido: followedId
      };

      this.seguidoresService.saveSeguidor(followDto).subscribe({
        next: () => {
          this.seguido = true;
          this.mostrarToast(`Ahora sigues a ${this.usuario?.nombre}`, 'success');
        },
        error: (error) => {
          let mensaje = 'Error al seguir.';
          if (error.status === 409) {
            mensaje = 'Ya estás siguiendo a este usuario.';
          }
          this.mostrarToast(mensaje, 'danger');
        }
      });
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}
