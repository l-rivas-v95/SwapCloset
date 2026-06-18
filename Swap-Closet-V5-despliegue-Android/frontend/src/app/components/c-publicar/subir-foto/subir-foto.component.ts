import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ModalFotosComponent} from "./modal-fotos/modal-fotos.component";
import {ImagenFormService} from "../../../service/imagenFormService/imagen-form.service";
import {Subscription} from "rxjs";
import {OverlayService} from "../../../service/overlay/overlay.service";

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

  fotos: string[] = [];
  private fotosSub?: Subscription;

  ngOnInit() {
    this.fotosSub = this.imagenesFormService.fotos$.subscribe(fotos => this.fotos = fotos);
  }

  ngOnDestroy() {
    this.fotosSub?.unsubscribe();
  }

  abrirGaleria() {
    this.overlayService.open(ModalFotosComponent, {});
  }

  eliminarFoto(event: Event, foto: string) {
    event.stopPropagation();
    this.imagenesFormService.eliminarFoto(foto);
  }
}
