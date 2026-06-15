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
      this.favoritosService.deleteFavorito(userId, productId).subscribe({
        next: () => {
          this.isFavorite.set(false);
          this.mostrarToast('Quitado de favoritos', 'medium');
        },
        error: () => this.mostrarToast('Error al quitar de favoritos.', 'danger')
      });
    } else {
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
