import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {NgForOf} from "@angular/common";
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";

@Component({
    selector: 'app-modal-fotos-perfil',
    templateUrl: './modal-fotos-perfil.component.html',
    styleUrls: ['./modal-fotos-perfil.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgForOf
    ]
})
export class ModalFotosPerfilComponent  implements OnInit {

  private modalCtrl = inject(ModalController);
  private formService = inject(ProductoFormService); // para acceder a imagenesPerfil

  imagenesDisponibles: string[] = this.formService.imagenesPerfil

  cerrar() {
    this.modalCtrl.dismiss();
  }

  seleccionar(ruta: string) {
    this.modalCtrl.dismiss({ ruta });
  }
  constructor() { }

  ngOnInit() {}

}

