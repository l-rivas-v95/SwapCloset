import {Component, inject} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NativeToastService} from "../../../../service/nativeToastService/native-toast.service";
import {CommonModule} from "@angular/common";
import {ImagenFormService} from "../../../../service/imagenFormService/imagen-form.service";
import {ProductoService} from "../../../../service/productoService/producto.service";
import {firstValueFrom} from "rxjs";
import {OverlayService} from "../../../../service/overlay/overlay.service";

@Component({
  selector: 'app-modal-fotos',
  templateUrl: './modal-fotos.component.html',
  styleUrls: ['./modal-fotos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ModalFotosComponent {
  private imagenesFormService = inject(ImagenFormService);
  private productoService = inject(ProductoService);
  private toast = inject(NativeToastService);
  private overlayService = inject(OverlayService);

  subiendo = false;

  close() {
    this.overlayService.close(null);
  }

  async seleccionarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);
    if (archivos.length === 0) return;

    const imagenesValidas = archivos.filter(archivo => archivo.type.startsWith('image/'));
    if (imagenesValidas.length !== archivos.length) {
      this.toast.show('Solo se pueden subir imágenes');
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
      this.overlayService.close({ rutas: urlsSubidas });
    } catch (error) {
      this.subiendo = false;
      this.toast.show('Error al subir imágenes');
    }
  }
}
