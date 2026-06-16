import {Component, inject} from '@angular/core';
import {IonicModule, ModalController, ToastController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ImagenFormService} from "../../../../service/imagenFormService/imagen-form.service";
import {ProductoService} from "../../../../service/productoService/producto.service";

@Component({
  selector: 'app-modal-fotos',
  templateUrl: './modal-fotos.component.html',
  styleUrls: ['./modal-fotos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ModalFotosComponent {
  private modalCtrl = inject(ModalController);
  private imagenesFormService = inject(ImagenFormService);
  private productoService = inject(ProductoService);
  private toastCtrl = inject(ToastController);

  subiendo = false;

  cerrar() {
    this.modalCtrl.dismiss();
  }

  seleccionarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      this.mostrarToast('Selecciona una imagen válida');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    this.subiendo = true;
    this.productoService.subirFoto(formData).subscribe({
      next: (respuesta) => {
        this.imagenesFormService.agregarFoto(respuesta.url);
        this.subiendo = false;
        this.modalCtrl.dismiss({ ruta: respuesta.url });
      },
      error: async () => {
        this.subiendo = false;
        await this.mostrarToast('Error al subir imagen');
      }
    });
  }

  private async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
