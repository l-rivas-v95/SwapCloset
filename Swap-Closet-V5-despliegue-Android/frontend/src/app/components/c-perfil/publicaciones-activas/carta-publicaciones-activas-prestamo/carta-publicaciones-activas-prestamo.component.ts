import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-carta-publicaciones-activas-prestamo',
    templateUrl: './carta-publicaciones-activas-prestamo.component.html',
    styleUrls: ['./carta-publicaciones-activas-prestamo.component.scss'],
    standalone: true,
    imports: [
      [
        IonicModule,
        NgForOf
      ]
    ]
})
export class CartaPublicacionesActivasPrestamoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
