import {Component, EventEmitter, inject, Input, numberAttribute, OnInit, Output, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {DatePipe, LowerCasePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {CartaUsuarioDTO} from "../../../modelos/CartaUsuarioDTO";
import {ImagenProductoDTO} from "../../../modelos/ImagenProductoDTO";
import {RouterLink} from "@angular/router";
import {FavoritosService} from "../../../service/favoritosService/favoritos.service";
import {AuthService} from "../../../service/authService/auth.service";
import {FavoritoDTO} from "../../../modelos/FavoritoDTO";

@Component({
  selector: 'app-componente-anuncio',
  templateUrl: './componente-anuncio.component.html',
  styleUrls: ['./componente-anuncio.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    RouterLink,
    NgClass,
    NgIf,
    DatePipe,
    LowerCasePipe
  ]
})
export class ComponenteAnuncioComponent implements OnInit {

  @Input() producto: ProductoDTO | null = null;
  @Input() usuario: CartaUsuarioDTO | null = null;
  @Input() estilos: string[] = [];
  @Input() primeraImagen: string = '';

  @Input({transform: numberAttribute}) idUsuarioLogueado: number | undefined;
  @Input() modoEdicion: boolean = false;

  @Output() guardarHijo = new EventEmitter<ProductoDTO>();

  productoEditable!: ProductoDTO;
  isFavorite = signal<boolean>(false);
  indiceActivo = signal<number>(0);

  get imagenes(): ImagenProductoDTO[] {
    const imgs = this.producto?.imagenes ?? [];
    return imgs.length > 0 ? imgs : [{ urlImg: this.primeraImagen } as ImagenProductoDTO];
  }

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    this.indiceActivo.set(index);
  }

  private favoritosService = inject(FavoritosService);
  private authService = inject(AuthService);
  private toast = inject(NativeToastService);

  ngOnInit() {
    if (this.producto) {
      this.productoEditable = JSON.parse(JSON.stringify(this.producto));
    }
    this.checkInitialFavoriteState();
  }

  checkInitialFavoriteState() {
    const userId = this.idUsuarioLogueado;
    const productId = this.producto?.id;

    if (productId && userId) {
      this.favoritosService.isFavorito(userId, productId).subscribe({
        next: (isFav) => this.isFavorite.set(isFav),
        error: (err) => {
          console.error("Error al chequear favoritos:", err);
          this.isFavorite.set(false);
        }
      });
    }
  }

  toggleFavorite() {
    const userId = this.idUsuarioLogueado;
    const productId = this.producto?.id;

    if (!userId) { this.toast.show('Debes iniciar sesión para añadir favoritos.'); return; }
    if (!productId) { this.toast.show('Error: ID de producto no disponible.'); return; }

    if (this.isFavorite()) {
      this.favoritosService.deleteFavorito(userId, productId).subscribe({
        next: () => { this.isFavorite.set(false); this.toast.show('Quitado de favoritos'); },
        error: () => this.toast.show('Error al quitar de favoritos.')
      });
    } else {
      const favoritoDto: FavoritoDTO = { idUsuario: userId, idProducto: productId };
      this.favoritosService.saveFavorito(favoritoDto).subscribe({
        next: () => { this.isFavorite.set(true); this.toast.show('Añadido a favoritos'); },
        error: (error) => {
          this.toast.show(error.status === 400 || error.status === 409 ? 'El producto ya es tu favorito.' : 'Error al añadir a favoritos.');
        }
      });
    }
  }
}
