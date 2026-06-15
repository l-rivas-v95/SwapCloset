import { Component, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import { ToastController } from '@ionic/angular';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip,
} from '@ionic/angular/standalone';

import { CartaProductoDTO } from '../../../modelos/CartaProductoDTO';
import { AuthService } from '../../../service/authService/auth.service';
import { FavoritosService } from '../../../service/favoritosService/favoritos.service';
import { FavoritoDTO } from '../../../modelos/FavoritoDTO';

@Component({
  selector: 'app-carta-home-intercambio',
  templateUrl: './carta-home-intercambio.component.html',
  styleUrls: ['./carta-home-intercambio.component.scss'],
  standalone: true,
  imports: [
    // Ionic standalone components usados en el HTML
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
    IonIcon,
    IonChip,

    // Angular
    RouterModule,
    NgIf,
    NgClass,
    AsyncPipe,
    TitleCasePipe,
    DatePipe,
  ],
})
export class CartaHomeIntercambioComponent {
  producto = input.required<CartaProductoDTO>();

  // --- Estado de Favoritos (signal para reactividad) ---
  isFavorite = signal<boolean>(false);

  // --- Servicios ---
  private authService = inject(AuthService);
  private favoritosService = inject(FavoritosService);
  private toastCtrl = inject(ToastController);

  // ID del usuario logeado (se establece en ngOnInit)
  currentUserId: number | null = null;

  ngOnInit(): void {
    this.currentUserId = this.authService.getUsuario()?.id ?? null;
    this.checkInitialFavoriteState();
  }

  getImagenProducto(): string {
    return this.producto()?.urlImgProducto || 'assets/icon/card-media.png';
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/icon/card-media.png';
  }

  /**
   * Comprueba si el producto ya está en la lista de favoritos del usuario logeado.
   */
  checkInitialFavoriteState() {
    const userId = this.currentUserId;
    const productId = this.producto()?.productoId; // ID del producto desde el input signal

    if (productId && userId) {
      // Endpoint GET /api/favoritos/exists/{userId}/{productId}
      this.favoritosService.isFavorito(userId, productId).subscribe({
        next: (isFav) => {
          this.isFavorite.set(isFav);
        },
        error: (err) => {
          console.error('Error al chequear favoritos:', err);
          this.isFavorite.set(false);
        },
      });
    }
  }

  /**
   * Alterna el estado de favorito (POST para añadir, DELETE para quitar).
   */
  toggleFavorito() {
    const userId = this.currentUserId;
    const productId = this.producto()?.productoId;

    // 1. Validaciones
    if (!userId) {
      this.mostrarToast('Debes iniciar sesión para añadir favoritos.', 'danger');
      return;
    }

    if (!productId) {
      return; // Sin ID de producto, no se puede actuar
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
        },
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
          if (error?.status === 400 || error?.status === 409) {
            mensaje = 'El producto ya es tu favorito.';
          }
          this.mostrarToast(mensaje, 'danger');
        },
      });
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      // Si quieres usar el color, descomenta esto:
      // color
    });
    await toast.present();
  }
}
