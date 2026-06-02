import {Component, EventEmitter, inject, Input, numberAttribute, OnInit, Output, signal} from '@angular/core';
import {IonicModule, ToastController} from "@ionic/angular";
import {DatePipe, LowerCasePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {CartaUsuarioDTO} from "../../../modelos/CartaUsuarioDTO";
import {RouterLink} from "@angular/router";
import {FavoritosService} from "../../../service/favoritosService/favoritos.service";
import {AuthService} from "../../../service/authService/auth.service";
import {FavoritoDTO} from "../../../modelos/FavoritoDTO";


@Component({
  selector: 'app-anuncio-componente',
  templateUrl: './anuncio-componente.component.html',
  styleUrls: ['./anuncio-componente.component.scss'],
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
export class AnuncioComponenteComponent implements OnInit {

  @Input() producto: ProductoDTO | null = null;
  @Input() usuario: CartaUsuarioDTO | null = null;
  @Input() estilos: string[] = [];
  @Input() primeraImagen: string = '';

  @Input({transform: numberAttribute}) idUsuarioLogueado: number | undefined;
  @Input() modoEdicion: boolean = false;

  @Output() guardarHijo = new EventEmitter<ProductoDTO>();

  productoEditable!: ProductoDTO;

  // --- ESTADO DE FAVORITOS ---
  isFavorite = signal<boolean>(false);

  // --- INYECCIÓN DE SERVICIOS ---
  private favoritosService = inject(FavoritosService);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);


  ngOnInit() {
    if (this.producto) {
      this.productoEditable = JSON.parse(JSON.stringify(this.producto));
    }
    this.checkInitialFavoriteState();
  }


  checkInitialFavoriteState() {
    const userId = this.idUsuarioLogueado;
    const productId = this.producto?.id;

    // Solo se chequea si el usuario está logueado Y el producto tiene ID.
    if (productId && userId) {
      this.favoritosService.isFavorito(userId, productId).subscribe({
        next: (isFav) => {
          this.isFavorite.set(isFav);
        },
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

    // 1. Validaciones
    if (!userId) {
      this.mostrarToast('Debes iniciar sesión para añadir favoritos.', 'danger');
      return;
    }

    if (!productId) {
      this.mostrarToast('Error: ID de producto no disponible.', 'danger');
      return;
    }

    const isFav = this.isFavorite();

    if (isFav) {

      // QUITAR FAVORITO
      this.favoritosService.deleteFavorito(userId, productId).subscribe({
        next: () => {
          this.isFavorite.set(false);
          this.mostrarToast('Quitado de favoritos', 'medium');
        },
        error: () => {
          this.mostrarToast('Error al quitar de favoritos.', 'danger');
        }
      });
    } else {

      // AÑADIR FAVORITO
      const favoritoDto: FavoritoDTO = { idUsuario: userId, idProducto: productId };

      this.favoritosService.saveFavorito(favoritoDto).subscribe({
        next: () => {
          this.isFavorite.set(true);
          this.mostrarToast('Añadido a favoritos', 'danger');
        },
        error: (error) => {
          let mensaje = 'Error al añadir a favoritos.';
          if (error.status === 400 || error.status === 409) {
            mensaje = 'El producto ya es tu favorito.';
          }
          this.mostrarToast(mensaje, 'danger');
        }
      });
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

}
