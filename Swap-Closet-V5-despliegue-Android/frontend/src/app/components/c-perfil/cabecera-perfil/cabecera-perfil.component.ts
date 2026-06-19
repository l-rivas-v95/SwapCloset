import {Component, computed, effect, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {UsuarioEstadisticasDTO} from "../../../modelos/UsuarioEstadisticasDTO";
import {ModalFotosPerfilComponent} from "../modal-fotos-perfil/modal-fotos-perfil.component";
import {AuthService} from "../../../service/authService/auth.service";
import {RaitingService} from "../../../service/raitingService/raiting.service";
import {SeguidoresService} from "../../../service/seguidoresService/seguidores.service";
import {RaitingDTO} from "../../../modelos/RaitingDTO";
import {SeguidorDTO} from "../../../modelos/SeguidorDTO";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {OverlayService} from "../../../service/overlay/overlay.service";

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

  private authService = inject(AuthService);
  private raitingService = inject(RaitingService);
  private seguidoresService = inject(SeguidoresService);
  private toast = inject(NativeToastService);
  private overlayService = inject(OverlayService);

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

  cambiarFoto() {
    if (!this.esMiPerfil) return;
    const usuarioActual = this.usuario();
    if (!usuarioActual?.id) { this.toast.show('Usuario no válido'); return; }

    this.overlayService.open(
      ModalFotosPerfilComponent,
      { idUsuario: usuarioActual.id },
      (data) => {
        if (!data?.usuario) return;
        const usuarioGuardado: UsuarioDTO = data.usuario;
        this.usuario.update((actual) => actual ? { ...actual, urlImg: usuarioGuardado.urlImg } : actual);
        this.usuarioActualizado.emit(usuarioGuardado);
        const usuarioSesion = this.authService.getUsuario();
        if (usuarioSesion?.id === usuarioGuardado.id) {
          this.authService.setUsuario({ ...usuarioSesion, ...usuarioGuardado });
        }
        this.toast.show('Foto de perfil actualizada');
      }
    );
  }

  setRating(valor: number) {
    if (this.esMiPerfil) return;
    if (this.haPuntuado()) { this.toast.show('Ya has valorado a este usuario anteriormente.'); return; }
    this.ratingSeleccionado.set(valor);
    this.confirmarYGuardarRaiting(valor);
  }

  private confirmarYGuardarRaiting(rating: number) {
    const usuarioPuntuador = this.authService.getUsuario();
    const idPuntuado = this.usuario()?.id;
    if (!usuarioPuntuador?.id || !idPuntuado) {
      this.toast.show('Error de autenticación o ID de usuario faltante.');
      this.ratingSeleccionado.set(0);
      return;
    }
    const raitingParaGuardar: RaitingDTO = { idPuntuado, idPuntuador: usuarioPuntuador.id, puntuacion: rating };
    this.raitingService.guardarRaiting(raitingParaGuardar).subscribe({
      next: () => { this.haPuntuado.set(true); this.toast.show(`Has valorado con ${rating} estrellas.`); },
      error: (error) => {
        const mensaje = error.status === 400 && error.error ? error.error : 'Error al guardar la valoración.';
        this.ratingSeleccionado.set(0);
        this.toast.show(mensaje);
      }
    });
  }

  private checkInitialFollowState() {
    const followedId = this.usuario()?.id;
    const follower = this.authService.getUsuario();
    if (!followedId || !follower?.id || followedId === follower.id) { this.isFollowing.set(false); return; }
    this.seguidoresService.isFollowing(follower.id, followedId).subscribe({
      next: (isFollowing) => this.isFollowing.set(isFollowing),
      error: () => this.isFollowing.set(false)
    });
  }

  toggleFollow() {
    if (this.esMiPerfil) return;
    const followedId = this.usuario()?.id;
    const follower = this.authService.getUsuario();
    if (!follower?.id || !followedId) { this.toast.show('Debes iniciar sesión para seguir a un usuario.'); return; }
    if (this.isFollowing()) {
      this.seguidoresService.deleteSeguidor(follower.id, followedId).subscribe({
        next: () => { this.isFollowing.set(false); this.toast.show('Has dejado de seguir a este usuario.'); },
        error: () => this.toast.show('Error al dejar de seguir.')
      });
    } else {
      const followDto: SeguidorDTO = { idSeguidor: follower.id, idSeguido: followedId };
      this.seguidoresService.saveSeguidor(followDto).subscribe({
        next: () => { this.isFollowing.set(true); this.toast.show('Ahora sigues a este usuario.'); },
        error: () => this.toast.show('Error al seguir al usuario.')
      });
    }
  }

  protected readonly Math = Math;
}
