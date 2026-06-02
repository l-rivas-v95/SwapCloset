import {Component, inject, input, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {Observable} from "rxjs";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {AsyncPipe, DatePipe, NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-carta-publicaciones-pasadas-prestado',
    templateUrl: './carta-publicaciones-pasadas-prestado.component.html',
    styleUrls: ['./carta-publicaciones-pasadas-prestado.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    NgOptimizedImage,
    AsyncPipe,
    DatePipe
  ]
})
export class CartaPublicacionesPasadasPrestadoComponent  implements OnInit {

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
