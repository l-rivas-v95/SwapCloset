import {Component, inject, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {BtnContactarComponent} from "../../components/c-anuncio/btn-contactar/btn-contactar.component";
import {ActivatedRoute, RouterLink, RouterModule} from "@angular/router";
import {AsyncPipe, NgForOf} from "@angular/common";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {ProductoService} from "../../service/productoService/producto.service";
import {Observable} from "rxjs";
import {RaitingService} from "../../service/raitingService/raiting.service";

@Component({
  selector: 'app-anuncio-prestamo',
  templateUrl: './anuncio-prestamo.page.html',
  styleUrls: ['./anuncio-prestamo.page.scss'],
  standalone: true,
    imports: [IonicModule, BtnContactarComponent, RouterModule, RouterLink, NgForOf, AsyncPipe]
})
export class AnuncioPrestamoPage implements OnInit {

  estilos = ['Casual', 'Informal', 'Ocasional', 'Fiesta', 'Verano'];

  idProducto!: string;
  media: Observable<number> | undefined;

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private raitingService = inject(RaitingService);

  // señal reactiva
  producto = signal<ProductoDTO | null>(null);

  ngOnInit() {
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
    console.log('ID del producto:', this.idProducto);

    this.cargarProducto(this.idProducto);
    this.media = this.raitingService.getMediaRaitingByUsuario(
      Number(this.idProducto)
    );
  }

  private cargarProducto(id: string) {
    this.productoService.getProducto(Number(id)).subscribe({
      next: (prod) => {
        if (!prod) {
          console.warn('Producto no encontrado con ID:', id);
          this.producto.set(null);
        } else {
          this.producto.set(prod);
        }
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.producto.set(null);
      }
    });
  }

  getPrimeraImagen(): string {
    const listImagenes = this.producto()?.imagenes;
    if (!listImagenes || listImagenes.length === 0) {
      return "";
    }
    return listImagenes[0]?.urlImg || "";
  }

}
