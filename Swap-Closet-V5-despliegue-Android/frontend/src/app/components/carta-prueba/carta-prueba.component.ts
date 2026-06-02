import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-carta-prueba',
  templateUrl: './carta-prueba.component.html',
  styleUrls: ['./carta-prueba.component.scss'],
  standalone: true,
  imports: [
    IonicModule, RouterLink
  ]
})
export class CartaPruebaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
