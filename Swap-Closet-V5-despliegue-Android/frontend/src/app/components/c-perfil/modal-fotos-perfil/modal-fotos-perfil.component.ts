import {Component, inject, Input} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {NgIf} from "@angular/common";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {OverlayService} from "../../../service/overlay/overlay.service";

@Component({
  selector: 'app-modal-fotos-perfil',
  templateUrl: './modal-fotos-perfil.component.html',
  styleUrls: ['./modal-fotos-perfil.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class ModalFotosPerfilComponent {
  @Input() idUsuario!: number;

  private usuarioService = inject(UsuarioService);
  private toastCtrl = inject(ToastController);
  private overlayService = inject(OverlayService);

  subiendo = false;

  close() { this.overlayService.close(null); }

  seleccionarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) { input.value = ''; return; }
    if (!this.idUsuario) { input.value = ''; this.mostrarToast('Usuario no válido'); return; }
    if (!archivo.type.startsWith('image/')) { input.value = ''; this.mostrarToast('Selecciona una imagen válida'); return; }

    const formData = new FormData();
    formData.append('archivo', archivo);
    this.subiendo = true;

    this.usuarioService.subirFotoPerfil(this.idUsuario, formData).subscribe({
      next: (usuarioActualizado) => {
        input.value = '';
        this.subiendo = false;
        this.overlayService.close({ usuario: usuarioActualizado });
      },
      error: async () => {
        input.value = '';
        this.subiendo = false;
        await this.mostrarToast('Error al subir la foto');
      }
    });
  }

  private async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 1800, position: 'bottom', color: 'dark' });
    await toast.present();
  }
}
