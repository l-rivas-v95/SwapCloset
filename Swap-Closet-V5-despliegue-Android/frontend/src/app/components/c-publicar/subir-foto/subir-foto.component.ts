import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {CommonModule, NgForOf} from "@angular/common";
import {ModalFotosComponent} from "./modal-fotos/modal-fotos.component";
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";

@Component({
  selector: 'app-subir-foto',
  templateUrl: './subir-foto.component.html',
  styleUrls: ['./subir-foto.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class SubirFotoComponent {

  private modalCtrl = inject(ModalController);

  async abrirGaleria() {
    const modal = await this.modalCtrl.create({
      component: ModalFotosComponent,
      cssClass: 'modal-galeria'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.ruta) {
      console.log('Imagen seleccionada:', data.ruta);
    }
  }
}
