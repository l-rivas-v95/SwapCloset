import {Component, inject} from '@angular/core';
import {IonicModule, ModalController, ToastController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ImagenFormService} from "../../../../service/imagenFormService/imagen-form.service";
import {ProductoService} from "../../../../service/productoService/producto.service";
import {firstValueFrom} from "rxjs";

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

  async seleccionarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);
    if (archivos.length === 0) return;

    const imagenesValidas = archivos.filter(archivo => archivo.type.startsWith('image/'));
    if (imagenesValidas.length !== archivos.length) {
      await this.mostrarToast('Solo se pueden subir imágenes');
    }

    if (imagenesValidas.length === 0) return;

    this.subiendo = true;
    const urlsSubidas: string[] = [];

    try {
      for (const archivo of imagenesValidas) {
        const formData = new FormData();
        formData.append('archivo', archivo);

        const respuesta = await firstValueFrom(this.productoService.subirFoto(formData));
        this.imagenesFormService.agregarFoto(respuesta.url);
        urlsSubidas.push(respuesta.url);
      }

      this.subiendo = false;
      this.modalCtrl.dismiss({ rutas: urlsSubidas });
    } catch (error) {
      this.subiendo = false;
      await this.mostrarToast('Error al subir imágenes');
    }
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
