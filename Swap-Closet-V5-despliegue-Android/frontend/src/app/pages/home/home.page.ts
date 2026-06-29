import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

import {
  IonHeader, IonToolbar, IonGrid, IonRow, IonCol,
  IonContent, IonRefresher, IonRefresherContent,
  ViewWillEnter
} from '@ionic/angular/standalone';

import { ProductoService } from '../../service/productoService/producto.service';
import { CartaProductoDTO } from '../../modelos/CartaProductoDTO';
import { CartaHomeIntercambioComponent } from '../../components/c-home/carta-home-intercambio/carta-home-intercambio.component';
import { HomeFiltrosService } from '../../service/homeFiltros/home-filtros.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule, RouterModule, RouterLink,
    IonHeader, IonToolbar, IonGrid, IonRow, IonCol,
    IonContent, IonRefresher, IonRefresherContent,
    CartaHomeIntercambioComponent,
  ],
})
export class HomePage implements OnInit, ViewWillEnter {

  private productoService = inject(ProductoService);
  filtros = inject(HomeFiltrosService);

  productos = signal<CartaProductoDTO[]>([]);

  productosFiltrados = computed(() =>
    this.productos().filter(p => this.filtros.matchProducto(p))
  );

  ngOnInit() { }
  ionViewWillEnter() { this.cargarProductos(); }

  cargarProductos() {
    this.productoService.getAllCartasProductosActivos().subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err)  => console.error('Error:', err)
    });
  }

  onRefresh(event: any) {
    this.productoService.getAllCartasProductosActivos().subscribe({
      next: (prods) => {
        this.productos.set(prods);
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }
}
