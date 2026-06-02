import { Component, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import {DescripcionProductoComponent} from "../../components/c-publicar/descripcion-producto/descripcion-producto.component";
import {TipoOfertaComponent} from "../../components/c-publicar/tipo-oferta/tipo-oferta.component";
import {DatosAdicionalesChipComponent} from "../../components/c-publicar/datos-adicionales-chip/datos-adicionales-chip.component";
import {SubirFotoComponent} from "../../components/c-publicar/subir-foto/subir-foto.component";
import {BotonPublicarComponent} from "../../components/c-publicar/boton-publicar/boton-publicar.component";

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: true,
    imports: [RouterModule, IonicModule, CommonModule, DescripcionProductoComponent, TipoOfertaComponent, DatosAdicionalesChipComponent, SubirFotoComponent, BotonPublicarComponent]
})
export class PublicarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
