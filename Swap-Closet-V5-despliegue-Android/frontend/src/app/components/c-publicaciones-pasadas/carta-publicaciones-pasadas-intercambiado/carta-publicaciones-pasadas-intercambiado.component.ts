import {Component, inject, input, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {Observable} from "rxjs";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {AsyncPipe, DatePipe} from "@angular/common";

@Component({
    selector: 'app-carta-publicaciones-pasadas-intercambiado',
    templateUrl: './carta-publicaciones-pasadas-intercambiado.component.html',
    styleUrls: ['./carta-publicaciones-pasadas-intercambiado.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    AsyncPipe,
    DatePipe
  ]
})
export class CartaPublicacionesPasadasIntercambiadoComponent  implements OnInit {

  producto= input.required<ProductoDTO>();
  usuario$!: Observable<UsuarioDTO>;

  private usuarioService = inject(UsuarioService);

  getPrimeraImagen(): string {
    const listImagenes = this.producto()?.imagenes;
    if (!listImagenes || listImagenes.length === 0) {
      return "";
    }
    return listImagenes[0]?.urlImg || "";
  }

  cargarUsuarioProducto(): Observable<UsuarioDTO> {
    const id = this.producto().idUsuario;
    if (!id) {
      throw new Error("El producto no tiene idUsuario");
    }

    return this.usuarioService.getUsuario(id);
  }

  ngOnInit() {
    this.usuario$ = this.cargarUsuarioProducto();
  }

}
