import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {
  CartaPublicacionesPasadasPrestadoComponent
} from "../../components/c-publicaciones-pasadas/carta-publicaciones-pasadas-prestado/carta-publicaciones-pasadas-prestado.component";
import {
  CartaPublicacionesPasadasIntercambiadoComponent
} from "../../components/c-publicaciones-pasadas/carta-publicaciones-pasadas-intercambiado/carta-publicaciones-pasadas-intercambiado.component";
import {FormsModule} from "@angular/forms";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {ProductoService} from "../../service/productoService/producto.service";
import {NgIf} from "@angular/common";
import { Location } from '@angular/common';


@Component({
  selector: 'app-publicaciones-pasadas',
  templateUrl: './publicaciones-pasadas.page.html',
  styleUrls: ['./publicaciones-pasadas.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CartaPublicacionesPasadasPrestadoComponent, CartaPublicacionesPasadasIntercambiadoComponent, FormsModule, NgIf]
})
export class PublicacionesPasadasPage implements OnInit {

  segmentoSeleccionado: 'prestamos' | 'intercambios' = 'prestamos';

  usuarioId!: number;

  // Productos separados por tipo
  productosPrestamos = signal<ProductoDTO[]>([]);
  productosIntercambios = signal<ProductoDTO[]>([]);

  // Productos filtrados según el segmento activo
  productosFiltrados = signal<ProductoDTO[]>([]);

  // Todos los productos inactivos, para pasarlos si se quiere
  todosProductos = signal<ProductoDTO[]>([]);

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
        // Filtrar solo productos inactivos (pasadas)
        const inactivos = prods.filter(p => !p.activo);

        // Guardar todos los inactivos
        this.todosProductos.set(inactivos);

        // Separar según tipo
        this.productosPrestamos.set(inactivos.filter(p => p.tipo == 'Intercambio'));
        this.productosIntercambios.set(inactivos.filter(p => p.tipo === 'Préstamo'));

        // Inicializar productosFiltrados según segmento
        this.actualizarProductosFiltrados();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  actualizarProductosFiltrados() {
    if (this.segmentoSeleccionado === 'prestamos') {
      this.productosFiltrados.set(this.productosPrestamos());
    } else {
      this.productosFiltrados.set(this.productosIntercambios());
    }
  }

  segmentChanged() {
    this.actualizarProductosFiltrados();
  }

  volver() {
    this.location.back();
  }
}
