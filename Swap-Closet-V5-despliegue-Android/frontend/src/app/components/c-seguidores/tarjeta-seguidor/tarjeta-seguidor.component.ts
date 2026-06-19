import {Component, Input, OnInit, inject} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {NgClass} from "@angular/common";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {SeguidoresService} from "../../../service/seguidoresService/seguidores.service";
import {AuthService} from "../../../service/authService/auth.service";
import {SeguidorDTO} from "../../../modelos/SeguidorDTO";
import {Router, RouterLink} from "@angular/router";

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
  private toast = inject(NativeToastService);
  private router = inject(Router);

  irAPerfil() {
    if (this.usuario?.id) this.router.navigate(['/perfil', this.usuario.id]);
  }

  seguido: boolean = false;
  isOwnProfile: boolean = false;

  ngOnInit(): void {
    this.checkInitialFollowState();
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
      this.toast.show('Debes iniciar sesión para realizar esta acción.');
      return;
    }
    if (this.isOwnProfile || !followedId) {
      return;
    }

    const followerId = follower.id;

    if (this.seguido) {
      this.seguidoresService.deleteSeguidor(followerId, followedId).subscribe({
        next: () => { this.seguido = false; this.toast.show(`Dejaste de seguir a ${this.usuario?.nombre}`); },
        error: () => this.toast.show('Error al dejar de seguir.')
      });
    } else {
      const followDto: SeguidorDTO = { idSeguidor: followerId, idSeguido: followedId };
      this.seguidoresService.saveSeguidor(followDto).subscribe({
        next: () => { this.seguido = true; this.toast.show(`Ahora sigues a ${this.usuario?.nombre}`); },
        error: (error) => {
          this.toast.show(error.status === 409 ? 'Ya estás siguiendo a este usuario.' : 'Error al seguir.');
        }
      });
    }
  }
}
