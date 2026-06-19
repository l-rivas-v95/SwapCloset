import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ModalFotosComponent} from "./modal-fotos/modal-fotos.component";
import {ImagenFormService} from "../../../service/imagenFormService/imagen-form.service";
import {Subscription} from "rxjs";
import {OverlayService} from "../../../service/overlay/overlay.service";
import {ProductoService} from "../../../service/productoService/producto.service";
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-subir-foto',
  templateUrl: './subir-foto.component.html',
  styleUrls: ['./subir-foto.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SubirFotoComponent implements OnInit, OnDestroy {
  private imagenesFormService = inject(ImagenFormService);
  private overlayService = inject(OverlayService);
  private productoService = inject(ProductoService);
  private toast = inject(NativeToastService);

  @ViewChild('cameraInput') cameraInput!: ElementRef<HTMLInputElement>;

  fotos: string[] = [];
  subiendo = false;
  private fotosSub?: Subscription;

  ngOnInit() {
    this.fotosSub = this.imagenesFormService.fotos$.subscribe(fotos => this.fotos = fotos);
  }

  ngOnDestroy() {
    this.fotosSub?.unsubscribe();
  }

  abrirCamara() {
    this.cameraInput.nativeElement.click();
  }

  async onCameraFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) { this.toast.show('Selecciona una imagen válida'); return; }

    this.subiendo = true;
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      const respuesta = await firstValueFrom(this.productoService.subirFoto(formData));
      this.imagenesFormService.agregarFoto(respuesta.url);
    } catch {
      this.toast.show('Error al subir la foto');
    } finally {
      this.subiendo = false;
    }
  }

  abrirGaleria() {
    this.overlayService.open(ModalFotosComponent, {});
  }

  eliminarFoto(event: Event, foto: string) {
    event.stopPropagation();
    this.imagenesFormService.eliminarFoto(foto);
  }
}
