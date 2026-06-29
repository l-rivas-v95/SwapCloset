import {Component, inject, input, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {Observable} from "rxjs";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {ImagenProductoService} from "../../../service/imagenProductoService/imagen-producto.service";
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
export class CartaPublicacionesPasadasIntercambiadoComponent implements OnInit {

  producto = input.required<ProductoDTO>();
  usuario$!: Observable<UsuarioDTO>;
  imagenIntercambio = signal<string>('assets/icon/card-media.png');

  private usuarioService = inject(UsuarioService);
  private imagenProductoService = inject(ImagenProductoService);

  getPrimeraImagen(): string {
    const listImagenes = this.producto()?.imagenes;
    if (!listImagenes || listImagenes.length === 0) {
      return 'assets/icon/card-media.png';
    }
    return listImagenes[0]?.urlImg || 'assets/icon/card-media.png';
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/icon/card-media.png';
  }

  ngOnInit() {
    this.usuario$ = this.usuarioService.getUsuario(this.producto().idUsuario!);

    // producto → chatsProducto1[0] → producto2Id → getImagenPrincipal(producto2Id)
    if (this.producto().tipo !== 'Préstamo') {
      // Si este producto era producto1 en el chat → el intercambiado es producto2
      // Si era producto2 → el intercambiado es producto1
      const otroId =
        this.producto().chatsProducto1?.[0]?.producto2Id ??
        this.producto().chatsProducto2?.[0]?.producto1Id;

      if (otroId) {
        this.imagenProductoService.getImagenPrincipal(otroId).subscribe({
          next: (url) => { if (url) this.imagenIntercambio.set(url); },
          error: () => {}
        });
      }
    }
  }
}
