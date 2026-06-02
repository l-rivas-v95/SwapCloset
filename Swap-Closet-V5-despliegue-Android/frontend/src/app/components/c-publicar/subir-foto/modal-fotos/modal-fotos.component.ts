import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ProductoFormService} from "../../../../service/productoFormService/producto-form.service";
import {ImagenFormService} from "../../../../service/imagenFormService/imagen-form.service";

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

  imagenesDisponibles: string[] = this.imagenesFormService.getListaImagenes()

  cerrar() {
    this.modalCtrl.dismiss();
  }

  seleccionar(ruta: string) {
    this.imagenesFormService.agregarFoto(ruta);
    this.modalCtrl.dismiss({ ruta });
  }
}
