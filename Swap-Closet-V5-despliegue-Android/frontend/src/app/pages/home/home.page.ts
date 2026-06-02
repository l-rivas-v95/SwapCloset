import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

import {
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonChip,
  IonContent
} from '@ionic/angular/standalone';

import { ProductoService } from '../../service/productoService/producto.service';
import { CartaProductoDTO } from '../../modelos/CartaProductoDTO';

import { CartaHomeIntercambioComponent } from '../../components/c-home/carta-home-intercambio/carta-home-intercambio.component';
import { DatosAdicionalesChipComponent } from '../../components/c-publicar/datos-adicionales-chip/datos-adicionales-chip.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    RouterLink,

    // Ionic standalone (exactos)
    IonHeader,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonChip,
    IonContent,

    // Components
    CartaHomeIntercambioComponent,
    DatosAdicionalesChipComponent
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }),
        animate('250ms ease-out', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class HomePage implements OnInit {
  mostrarMenu = false;

  private productoService = inject(ProductoService);

  productos = signal<CartaProductoDTO[]>([]);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getAllCartasProductosActivos().subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err) => console.error('Error:', err)
    });
  }

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }
}
