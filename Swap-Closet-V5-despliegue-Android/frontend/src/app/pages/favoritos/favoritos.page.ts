import {Component, inject, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {FavoritosService} from "../../service/favoritosService/favoritos.service";
import {
  CartaHorizontalIntercambioComponent
} from "../../components/c-explorar/carta-horizontal-intercambio/carta-horizontal-intercambio.component";
import { Location, NgIf } from '@angular/common';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, FormsModule, CartaHorizontalIntercambioComponent, NgIf]
})
export class FavoritosPage implements OnInit {

  segmentoSeleccionado: 'intercambios' | 'prestamos' = 'intercambios';
  busqueda = '';
  productos = signal<ProductoDTO[]>([]);

  private favoritosService = inject(FavoritosService);
  private route = inject(ActivatedRoute);

  idUsuario!: number;
  constructor(private location: Location) {}

  ngOnInit() {
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.idUsuario) {
      console.error('No se ha recibido idUsuario en la ruta');
      return;
    }
    this.cargarProductos(this.idUsuario);
  }

  cargarProductos(idUsuario: number) {
    this.favoritosService.getFavoritosByUsuario(idUsuario).subscribe({
      next: (prods) => {
        this.productos.set(prods);
      },
      error: (err) => console.error('Error al cargar favoritos:', err)
    });
  }

  get productosFiltrados(): ProductoDTO[] {
    const tipo = this.segmentoSeleccionado === 'intercambios' ? 'intercambio' : 'préstamo';
    const texto = this.busqueda.trim().toLowerCase();

    return this.productos()
      .filter(p => p.tipo?.toLowerCase() === tipo)
      .filter(p => {
        if (!texto) return true;
        return [p.titulo, p.descripcion, p.categoria, p.marca, p.talla, p.estado]
          .some(valor => valor?.toString().toLowerCase().includes(texto));
      });
  }

  volver() {
    this.location.back();
  }
}
