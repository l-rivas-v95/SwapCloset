import {Component, effect, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {
    CartaPublicacionesActivasIntercambioComponent
} from "../../components/c-perfil/publicaciones-activas/carta-publicaciones-activas-intercambio/carta-publicaciones-activas-intercambio.component";
import {IonicModule} from "@ionic/angular";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {ProductoService} from "../../service/productoService/producto.service";
import {RouterModule} from "@angular/router";

@Component({
    selector: 'app-publicaciones-activas-shared',
    templateUrl: './publicaciones-activas.component.html',
    styleUrls: ['./publicaciones-activas.component.scss'],
    standalone: true,
    imports: [
        CartaPublicacionesActivasIntercambioComponent,
        IonicModule,
      RouterModule
    ]
})
export class PublicacionesActivasComponent  implements OnInit {

  @Input() usuario!: WritableSignal<UsuarioDTO | null>;
  productos = signal<ProductoDTO[]>([]);
  private productoService = inject(ProductoService);

  // Effect se define como field initializer, no en ngOnInit
  private cargarProductosEffect = effect(() => {
    const usr = this.usuario();
    if (usr && typeof usr.id === 'number') {
      this.cargarProductos(usr.id);
    }
  });

  // Usamos directamente el id que recibimos como parámetro
  private cargarProductos(id: number) {
    this.productoService.getProductosByUsuario(id).subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  ngOnInit(): void {
  }
}
