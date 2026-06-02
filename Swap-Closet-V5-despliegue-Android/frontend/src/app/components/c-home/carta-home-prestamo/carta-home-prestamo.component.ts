import {Component, inject, input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {IonChip} from "@ionic/angular";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {Observable} from "rxjs";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-carta-home-prestamo',
    templateUrl: './carta-home-prestamo.component.html',
    styleUrls: ['./carta-home-prestamo.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    AsyncPipe
  ]
})
export class CartaHomePrestamoComponent  implements OnInit {

  producto= input.required<ProductoDTO>();
  usuario$!: Observable<UsuarioDTO>;

  private usuarioService = inject(UsuarioService);
  cargarUsuarioProducto(): Observable<UsuarioDTO> {
    const id = this.producto().idUsuario;
    if (!id) {
      throw new Error("El producto no tiene idUsuario");
    }

    return this.usuarioService.getUsuario(id);
  }

  getPrimeraImagen(): string {
    const listImagenes = this.producto()?.imagenes;

    if (!listImagenes || listImagenes.length === 0) {
      return "";
    }

    return listImagenes[0]?.urlImg || "";
  }

  ngOnInit() {
    this.usuario$ = this.cargarUsuarioProducto();
  }

}
