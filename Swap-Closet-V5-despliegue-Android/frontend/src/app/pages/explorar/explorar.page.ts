import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {CartaHorizontalIntercambioComponent} from "../../components/c-explorar/carta-horizontal-intercambio/carta-horizontal-intercambio.component";
import {RouterModule} from "@angular/router";
import {ProductoService} from "../../service/productoService/producto.service";
import {ProductoDTO} from "../../modelos/ProductoDTO";

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CartaHorizontalIntercambioComponent, RouterModule],
})
export class ExplorarPage implements OnInit {

  private productoService = inject(ProductoService);

  productos = signal<ProductoDTO[]>([]);
  busqueda = signal<string>('');

  productosFiltrados = computed(() => {
    const term = this.busqueda().toLowerCase().trim();
    if (!term) return this.productos();
    return this.productos().filter(p =>
      (p.titulo  ?? '').toLowerCase().includes(term) ||
      (p.marca   ?? '').toLowerCase().includes(term) ||
      (p.categoria ?? '').toLowerCase().includes(term) ||
      (p.tipo    ?? '').toLowerCase().includes(term) ||
      (p.color   ?? '').toLowerCase().includes(term) ||
      (p.estilo  ?? '').toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err) => console.error('Error:', err)
    });
  }

}
