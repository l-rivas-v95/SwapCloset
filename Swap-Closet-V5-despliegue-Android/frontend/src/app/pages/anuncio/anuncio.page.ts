import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicModule,
  ToastController
} from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location, NgIf } from '@angular/common';

import { ProductoDTO } from '../../modelos/ProductoDTO';
import { CartaUsuarioDTO } from '../../modelos/CartaUsuarioDTO';

import { ProductoService } from '../../service/productoService/producto.service';
import { UsuarioService } from '../../service/usuarioService/usuario.service';
import { AuthService } from '../../service/authService/auth.service';

import { BtnContactarComponent } from '../../components/c-anuncio/btn-contactar/btn-contactar.component';
import { ComponenteAnuncioComponent } from '../../components/c-anuncio/componente-anuncio/componente-anuncio.component';
import { FormularioAnuncioComponent } from '../../components/c-anuncio/formulario-anuncio/formulario-anuncio.component';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.page.html',
  styleUrls: ['./anuncio.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    NgIf,
    BtnContactarComponent,
    ComponenteAnuncioComponent,
    FormularioAnuncioComponent
  ]
})
export class AnuncioPage implements OnInit {

  idProducto!: string;

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private actionSheetCtrl = inject(ActionSheetController);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  private location = inject(Location);
  private toastCtrl = inject(ToastController);

  idUsuarioLogueado = this.authService.getUsuario()?.id ?? null;

  producto = signal<ProductoDTO | null>(null);
  usuario = signal<CartaUsuarioDTO | null>(null);
  estilos = signal<string[]>([]);
  modoEdicion = signal<boolean>(false);

  ngOnInit() {
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
    this.cargarProducto(this.idProducto);
  }

  private cargarProducto(id: string) {
    this.productoService.getProducto(Number(id)).subscribe({
      next: (prod) => {
        if (!prod) return;

        this.producto.set(prod);

        const listaEstilos = prod.estilo
          ? prod.estilo.split(',').map(e => e.trim())
          : [];
        this.estilos.set(listaEstilos);

        if (prod.idUsuario) {
          this.usuarioService
            .getCartaUsuarios(prod.idUsuario)
            .subscribe(u => this.usuario.set(u));
        }
      },
      error: (err) => console.error('Error al cargar anuncio:', err)
    });
  }

  getPrimeraImagen(): string {
    return this.producto()?.imagenes?.[0]?.urlImg
      || 'assets/icon/card-media.png';
  }

  volver() {
    if (!this.producto()?.id) return;
    this.cargarProducto(String(this.producto()?.id));
    this.location.back();
  }

  async mostrarOpciones() {
    if (this.producto()?.idUsuario !== this.idUsuarioLogueado) return;

    const sheet = await this.actionSheetCtrl.create({
      header: 'Opciones del Anuncio',
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => this.modoEdicion.set(true)
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => this.confirmarEliminacion()
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });

    await sheet.present();
  }

  async confirmarEliminacion() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Seguro que deseas eliminar este anuncio?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.eliminarAnuncio() }
      ]
    });

    await alert.present();
  }

  eliminarAnuncio() {
    const id = this.producto()?.id;
    if (!id) return;

    this.productoService.eliminarProducto(id).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  onGuardar(productoActualizado: any) {
    this.producto.set(productoActualizado);
    this.modoEdicion.set(false);
    if (productoActualizado?.id) {
      this.cargarProducto(String(productoActualizado.id));
    }
  }

  onCancelar() {
    this.modoEdicion.set(false);
    if (!this.producto()?.id) return;
    this.cargarProducto(String(this.producto()?.id));
  }
}
