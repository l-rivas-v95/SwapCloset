import {Component, effect, inject, Input, OnInit, signal} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {AsyncPipe, NgClass} from "@angular/common";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {FavoritosService} from "../../../service/favoritosService/favoritos.service";
import {RaitingService} from "../../../service/raitingService/raiting.service";
import {Observable} from "rxjs";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {ActivatedRoute} from "@angular/router";
import {SeguidoresService} from "../../../service/seguidoresService/seguidores.service";
import {AuthService} from "../../../service/authService/auth.service";
import {SeguidorDTO} from "../../../modelos/SeguidorDTO";

@Component({
  selector: 'app-tarjeta-seguidor',
  templateUrl: './tarjeta-seguidor.component.html',
  styleUrls: ['./tarjeta-seguidor.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgClass,
    AsyncPipe
  ]
})
export class TarjetaSeguidorComponent implements OnInit{

  // --- Inputs ---
  @Input() usuario: UsuarioDTO | null = null; // Usuario a mostrar y seguir/dejar de seguir
  @Input() media!: Observable<number>; // La media de valoración (solo se usa en el template)

  // --- Servicios ---
  private seguidoresService = inject(SeguidoresService);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  // --- Estado ---
  seguido: boolean = false;
  isOwnProfile: boolean = false;

  ngOnInit(): void {
    this.checkInitialFollowState();
  }

  /**
   * Comprueba si el usuario logeado está viendo su propio perfil o si ya lo sigue.
   */
  checkInitialFollowState() {
    const followedId = this.usuario?.id; // ID del usuario en la tarjeta
    const follower = this.authService.getUsuario(); // ID del usuario logeado

    if (!followedId || !follower?.id) {
      this.seguido = false;
      return;
    }

    // 1. Verificar si es el propio perfil
    if (follower.id === followedId) {
      this.isOwnProfile = true;
      this.seguido = false; // No tiene sentido seguirse a sí mismo
      return;
    }

    // 2. Si no es el propio perfil, verificar el estado de seguimiento
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


  toggleSeguir() {
    const followedId = this.usuario?.id;
    const follower = this.authService.getUsuario();

    //  Validaciones
    if (!follower || !follower.id) {
      this.mostrarToast('Debes iniciar sesión para realizar esta acción.', 'danger');
      return;
    }
    if (this.isOwnProfile || !followedId) {
      return;
    }

    const followerId = follower.id;

    if (this.seguido) {
      // DEJAR DE SEGUIR (DELETE)
      this.seguidoresService.deleteSeguidor(followerId, followedId).subscribe({
        next: () => {
          this.seguido = false;
          this.mostrarToast(`Dejaste de seguir a ${this.usuario?.nombre}`, 'success');
          // Nota: Si necesitas actualizar el contador de seguidores global,
          // tendrías que emitir un evento desde aquí.
        },
        error: () => {
          this.mostrarToast('Error al dejar de seguir.', 'danger');
        }
      });
    } else {

      //SEGUIR (POST)
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

