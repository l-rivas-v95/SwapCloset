import {Component, Input} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ProductoDTO} from "../../../../modelos/ProductoDTO";
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-carta-publicaciones-activas-intercambio',
  templateUrl: './carta-publicaciones-activas-intercambio.component.html',
  styleUrls: ['./carta-publicaciones-activas-intercambio.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgClass
  ]
})
export class CartaPublicacionesActivasIntercambioComponent {

  @Input() producto!: ProductoDTO;

  getPrimeraImagen(): string {
    const listImagenes = this.producto?.imagenes;
    if (!listImagenes || listImagenes.length === 0) {
      return "assets/icon/card-media.png";
    }
    return listImagenes[0]?.urlImg || "assets/icon/card-media.png";
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/icon/card-media.png';
  }
}
