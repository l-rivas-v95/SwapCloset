import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ModalFotosComponent} from "./modal-fotos/modal-fotos.component";
import {ImagenFormService} from "../../../service/imagenFormService/imagen-form.service";
import {Subscription} from "rxjs";

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
export class SubirFotoComponent implements OnInit, OnDestroy {

  private modalCtrl = inject(ModalController);
  private imagenesFormService = inject(ImagenFormService);

  fotos: string[] = [];
  private fotosSub?: Subscription;

  ngOnInit() {
    this.fotosSub = this.imagenesFormService.fotos$.subscribe(fotos => this.fotos = fotos);
  }

  ngOnDestroy() {
    this.fotosSub?.unsubscribe();
  }

  async abrirGaleria() {
    const modal = await this.modalCtrl.create({
      component: ModalFotosComponent,
      cssClass: 'modal-galeria'
    });

    await modal.present();
  }

  eliminarFoto(event: Event, foto: string) {
    event.stopPropagation();
    this.imagenesFormService.eliminarFoto(foto);
  }
}
