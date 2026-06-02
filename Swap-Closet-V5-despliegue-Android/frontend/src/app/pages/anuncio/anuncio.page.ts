import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {BtnContactarComponent} from "../../components/c-anuncio/btn-contactar/btn-contactar.component";
import {
  AnuncioIntercambioComponent
} from "../../components/c-anuncio/anuncio-intercambio/anuncio-intercambio.component";
import {AnuncioPrestamoComponent} from "../../components/c-anuncio/anuncio-prestamo/anuncio-prestamo.component";

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.page.html',
  styleUrls: ['./anuncio.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, BtnContactarComponent, AnuncioIntercambioComponent, AnuncioPrestamoComponent]
})
export class AnuncioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
