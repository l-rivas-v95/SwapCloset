import {Component, inject, OnInit, signal} from '@angular/core';
import{IonicModule} from "@ionic/angular";
import {
  CartaHorizontalIntercambioComponent
} from "../../components/c-explorar/carta-horizontal-intercambio/carta-horizontal-intercambio.component";
import {ActivatedRoute, RouterLink, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ProductoService} from "../../service/productoService/producto.service";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import { Location } from '@angular/common';

@Component({
  selector: 'app-publicaciones-activas',
  templateUrl: './publicaciones-activas.page.html',
  styleUrls: ['./publicaciones-activas.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CartaHorizontalIntercambioComponent, RouterLink, FormsModule]
})
export class PublicacionesActivasPage implements OnInit {

  segmentoSeleccionado: 'prestamos' | 'intercambios' = 'intercambios';
  productosPrestamos = signal<ProductoDTO[]>([]);
  productosIntercambios = signal<ProductoDTO[]>([]);
  productosFiltrados = signal<ProductoDTO[]>([]); // productos que se muestran según segmento

  usuarioId!: number;
  private productoService = inject(ProductoService);

  constructor(private route: ActivatedRoute,
              private location: Location) {}

  ngOnInit() {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductosByUsuario(this.usuarioId).subscribe({
      next: (prods) => {
        const porFecha = (a: ProductoDTO, b: ProductoDTO) => {
          const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
          const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
          return dateB - dateA;
        };

        const activos = prods.filter(p => p.activo === true);

        this.productosPrestamos.set(activos.filter(p => p.tipo === 'Préstamo').sort(porFecha));
        this.productosIntercambios.set(activos.filter(p => p.tipo === 'Intercambio').sort(porFecha));

        this.actualizarProductosFiltrados();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  // Cambia la lista que se muestra según el segmento
  actualizarProductosFiltrados() {
    if (this.segmentoSeleccionado === 'prestamos') {
      this.productosFiltrados.set(this.productosPrestamos());
    } else {
      this.productosFiltrados.set(this.productosIntercambios());
    }
  }

  // Llamar desde ion-segment
  segmentChanged() {
    this.actualizarProductosFiltrados();
  }

  volver() {
    this.location.back();
  }
}
