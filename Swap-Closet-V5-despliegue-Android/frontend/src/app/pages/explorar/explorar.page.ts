import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CartaHorizontalIntercambioComponent } from '../../components/c-explorar/carta-horizontal-intercambio/carta-horizontal-intercambio.component';
import { ProductoService } from '../../service/productoService/producto.service';
import { ProductoDTO } from '../../modelos/ProductoDTO';
import { ExplorarFiltrosService } from '../../service/explorarFiltros/explorar-filtros.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CartaHorizontalIntercambioComponent, RouterModule],
})
export class ExplorarPage implements OnInit {

  private productoService = inject(ProductoService);
  filtros = inject(ExplorarFiltrosService);

  productos = signal<ProductoDTO[]>([]);

  productosFiltrados = computed(() =>
    this.productos().filter(p => this.filtros.matchProducto(p))
  );

  ngOnInit() { this.cargarProductos(); }

  cargarProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err)  => console.error('Error:', err),
    });
  }
}
