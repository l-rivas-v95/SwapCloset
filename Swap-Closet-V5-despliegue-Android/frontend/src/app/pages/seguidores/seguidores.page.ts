import {Component, effect, inject, Input, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TarjetaSeguidorComponent} from "../../components/c-seguidores/tarjeta-seguidor/tarjeta-seguidor.component";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {SeguidoresService} from "../../service/seguidoresService/seguidores.service";
import {CommonModule, NgForOf} from "@angular/common";
import { Location } from '@angular/common';

@Component({
  selector: 'app-seguidores',
  templateUrl: './seguidores.page.html',
  styleUrls: ['./seguidores.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule, TarjetaSeguidorComponent, NgForOf]
})
export class SeguidoresPage {

  segmentoSeleccionado: string = 'seguidores';
  busqueda: string = '';

  seguidores = signal<UsuarioDTO[]>([]);
  seguidos = signal<UsuarioDTO[]>([]);

  filtrar(lista: UsuarioDTO[]): UsuarioDTO[] {
    const term = this.busqueda.toLowerCase().trim();
    if (!term) return lista;
    return lista.filter(u =>
      `${u.nombre ?? ''} ${u.apellidos ?? ''}`.toLowerCase().includes(term)
    );
  }

  private seguidoresService = inject(SeguidoresService);
  private route = inject(ActivatedRoute);

  idUsuarioSignal = signal<number | null>(null);
  constructor(private location: Location) {
    this.route.paramMap.subscribe(params => {
      this.idUsuarioSignal.set(Number(params.get('id')));
    });

    effect(() => {
      const id = this.idUsuarioSignal();
      if (!id) return;

      this.seguidoresService.getSeguidores(id).subscribe(s => this.seguidores.set(s));
      this.seguidoresService.getSiguiendo(id).subscribe(s => this.seguidos.set(s));
    });
  }

  volver() {
    this.location.back();
  }

}
