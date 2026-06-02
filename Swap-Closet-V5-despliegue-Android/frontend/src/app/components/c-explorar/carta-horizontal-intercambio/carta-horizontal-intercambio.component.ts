import {Component, inject, input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {Observable} from "rxjs";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {AsyncPipe, DatePipe, NgClass, NgIf} from "@angular/common";
import {RaitingService} from "../../../service/raitingService/raiting.service";

@Component({
    selector: 'app-carta-horizontal-intercambio',
    templateUrl: './carta-horizontal-intercambio.component.html',
    styleUrls: ['./carta-horizontal-intercambio.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    NgIf,
    AsyncPipe,
    NgClass,
    DatePipe
  ]
})
export class CartaHorizontalIntercambioComponent  implements OnInit {

  producto= input.required<ProductoDTO>();
  usuario$!: Observable<UsuarioDTO>;
  media: Observable<number> | undefined;

  private usuarioService = inject(UsuarioService);
  private raitingService = inject(RaitingService);

  getPrimeraImagen(): string {
    const listImagenes = this.producto()?.imagenes;
    if (!listImagenes || listImagenes.length === 0) {
      return "";
    }
    return listImagenes[0]?.urlImg || "";
  }

  cargarUsuarioProducto(): Observable<UsuarioDTO> {
    const id = Number(this.producto().idUsuario);
    if (!id) {
      throw new Error("El producto no tiene idUsuario");
    }
    return this.usuarioService.getUsuario(id);
  }

  ngOnInit() {
    this.usuario$ = this.cargarUsuarioProducto();
    this.media = this.raitingService.getMediaRaitingByUsuario(
      Number(this.producto().idUsuario)
    );
  }

}
