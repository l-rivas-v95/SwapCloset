import {Component, inject, OnInit, signal} from '@angular/core';
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

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (prods) => {
        // set de productos y prefetch de imagen principal por producto
        this.productos.set(prods);
      },
      error: (err) => console.error('Error:', err)
    });
  }

}
