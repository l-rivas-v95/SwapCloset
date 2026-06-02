import {Component, effect, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";

import {
  CartaPublicacionesActivasIntercambioComponent
} from "./carta-publicaciones-activas-intercambio/carta-publicaciones-activas-intercambio.component";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {ProductoService} from "../../../service/productoService/producto.service";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {
  CartaPublicacionesActivasPrestamoComponent
} from "./carta-publicaciones-activas-prestamo/carta-publicaciones-activas-prestamo.component";

@Component({
    selector: 'app-publicaciones-activas',
    templateUrl: './publicaciones-activas.component.html',
    styleUrls: ['./publicaciones-activas.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    CartaPublicacionesActivasIntercambioComponent,

  ]
})
export class PublicacionesActivasComponent  implements OnInit {

  @Input() usuario!: WritableSignal<UsuarioDTO | null>;
  productos = signal<ProductoDTO[]>([]);
  private productoService = inject(ProductoService);

  // ✅ Effect se define como field initializer, no en ngOnInit
  private cargarProductosEffect = effect(() => {
    const usr = this.usuario();
    if (usr && typeof usr.id === 'number') {
      this.cargarProductos(usr.id);
    }
  });

  // ✅ Usamos directamente el id que recibimos como parámetro
  private cargarProductos(id: number) {
    this.productoService.getProductosByUsuario(id).subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  ngOnInit(): void {
  }
}
