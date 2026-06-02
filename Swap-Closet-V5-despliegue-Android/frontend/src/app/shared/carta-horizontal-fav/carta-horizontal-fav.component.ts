import {Component, Input} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {ProductoDTO} from "../../modelos/ProductoDTO";


@Component({
    selector: 'app-carta-horizontal-fav',
    templateUrl: './carta-horizontal-fav.component.html',
    styleUrls: ['./carta-horizontal-fav.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgClass
  ]
})
export class CartaHorizontalFavComponent {

  @Input() producto!: ProductoDTO;

}
