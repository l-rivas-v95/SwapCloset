import {Component, inject, Input} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
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
  private toast = inject(NativeToastService);
  private overlayService = inject(OverlayService);

  subiendo = false;

  close() { this.overlayService.close(null); }

  seleccionarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) { input.value = ''; return; }
    if (!this.idUsuario) { input.value = ''; this.toast.show('Usuario no válido'); return; }
    if (!archivo.type.startsWith('image/')) { input.value = ''; this.toast.show('Selecciona una imagen válida'); return; }

    const formData = new FormData();
    formData.append('archivo', archivo);
    this.subiendo = true;

    this.usuarioService.subirFotoPerfil(this.idUsuario, formData).subscribe({
      next: (usuarioActualizado) => {
        input.value = '';
        this.subiendo = false;
        this.overlayService.close({ usuario: usuarioActualizado });
      },
      error: () => {
        input.value = '';
        this.subiendo = false;
        this.toast.show('Error al subir la foto');
      }
    });
  }
}
