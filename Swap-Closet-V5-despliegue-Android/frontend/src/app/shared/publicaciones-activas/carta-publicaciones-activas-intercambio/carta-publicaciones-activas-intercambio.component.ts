import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {ProductoService} from "../../../service/productoService/producto.service";
import {RouterModule} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-carta-publicaciones-activas-intercambio',
    templateUrl: './carta-publicaciones-activas-intercambio.component.html',
    styleUrls: ['./carta-publicaciones-activas-intercambio.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    NgClass
  ]
})
export class CartaPublicacionesActivasIntercambioComponent  implements OnInit {

  @Input() producto!: ProductoDTO;

  productos = signal<ProductoDTO[]>([]);
  private productoService = inject(ProductoService);

  // Usamos directamente el id que recibimos como parámetro
  private cargarProductos() {
    const id = this.producto.idUsuario!;
    this.productoService.getProductosByUsuario(id).subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  getPrimeraImagen(): string {
    const listImagenes = this.producto?.imagenes;
    if (!listImagenes || listImagenes.length === 0) {
      return "";
    }
    return listImagenes[0]?.urlImg || "";
  }
  ngOnInit(): void {
    this.cargarProductos()
  }


}

