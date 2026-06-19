import { Component, inject, input, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {NativeToastService} from '../../../service/nativeToastService/native-toast.service';
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
  private toast = inject(NativeToastService);
  private destroyRef = inject(DestroyRef);

  // ID del usuario logeado
  currentUserId: number | null = null;

  ngOnInit(): void {
    // Suscribirse al observable para que funcione aunque el usuario
    // cargue tarde (race condition en Android WebView).
    // BehaviorSubject emite el valor actual de forma síncrona al suscribirse.
    this.authService.usuarioActual$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(usuario => {
        const prevId = this.currentUserId;
        this.currentUserId = usuario?.id ?? null;
        // Comprobar favoritos la primera vez que tengamos userId
        if (!prevId && this.currentUserId) {
          this.checkInitialFavoriteState();
        }
      });

    // Si ya estaba cargado (caso normal), checkear favoritos ahora
    if (this.currentUserId) {
      this.checkInitialFavoriteState();
    }
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
      this.toast.show('Debes iniciar sesión para añadir favoritos.');
      return;
    }

    if (!productId) {
      return; // Sin ID de producto, no se puede actuar
    }

    const isFav = this.isFavorite();

    if (isFav) {
      this.favoritosService.deleteFavorito(userId, productId).subscribe({
        next: () => { this.isFavorite.set(false); this.toast.show('Quitado de favoritos'); },
        error: () => this.toast.show('Error al quitar de favoritos.')
      });
    } else {
      const favoritoDto: FavoritoDTO = { idUsuario: userId, idProducto: productId };
      this.favoritosService.saveFavorito(favoritoDto).subscribe({
        next: () => { this.isFavorite.set(true); this.toast.show('Añadido a favoritos'); },
        error: (error) => {
          this.toast.show(error?.status === 400 || error?.status === 409 ? 'El producto ya es tu favorito.' : 'Error al añadir a favoritos.');
        }
      });
    }
  }
}
