import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-anuncio-prestamo',
    templateUrl: './anuncio-prestamo.component.html',
    styleUrls: ['./anuncio-prestamo.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgForOf,
        RouterLink
    ]
})
export class AnuncioPrestamoComponent  implements OnInit {

  estilos = ['Casual', 'Informal', 'Ocasional', 'Fiesta', 'Verano'];

  constructor() { }

  ngOnInit() {}

}
