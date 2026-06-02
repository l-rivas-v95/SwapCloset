import {Component, inject, Input, OnInit, signal, SimpleChanges} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {FavoritosService} from "../../service/favoritosService/favoritos.service";
import {CartaHorizontalFavComponent} from "../../shared/carta-horizontal-fav/carta-horizontal-fav.component";
import {
  CartaHorizontalIntercambioComponent
} from "../../components/c-explorar/carta-horizontal-intercambio/carta-horizontal-intercambio.component";
import { Location } from '@angular/common';


@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, FormsModule, CartaHorizontalFavComponent, CartaHorizontalIntercambioComponent]
})
export class FavoritosPage implements OnInit {

  segmentoSeleccionado: string = 'prestamos';
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
        console.log('Productos cargados:', this.productos());
      },
      error: (err) => console.error('Error al cargar favoritos:', err)
    });
  }

  // Getter para filtrar según segmento
  get productosFiltrados(): ProductoDTO[] {
    const tipo = this.segmentoSeleccionado === 'prestamos' ? 'intercambio' : 'préstamo';
    return this.productos().filter(p => p.tipo?.toLowerCase() === tipo);
  }

  volver() {
    this.location.back();
  }
}
