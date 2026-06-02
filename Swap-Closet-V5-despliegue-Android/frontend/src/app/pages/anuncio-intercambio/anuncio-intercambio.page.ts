import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicModule, ToastController
} from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location, NgIf } from '@angular/common';

import { ProductoDTO } from '../../modelos/ProductoDTO';
import { CartaUsuarioDTO } from '../../modelos/CartaUsuarioDTO';

import { ProductoService } from '../../service/productoService/producto.service';
import { UsuarioService } from '../../service/usuarioService/usuario.service';
import { AuthService } from '../../service/authService/auth.service';

import { BtnContactarComponent } from '../../components/c-anuncio/btn-contactar/btn-contactar.component';
import { AnuncioComponenteComponent } from '../../components/c-anuncio/anuncio-componente/anuncio-componente.component';
import { AnuncioIntercambioComponent } from '../../components/c-anuncio/anuncio-intercambio/anuncio-intercambio.component';
import {ProductoFormService} from "../../service/productoFormService/producto-form.service";

@Component({
  selector: 'app-anuncio-intercambio-page',
  standalone: true,
  templateUrl: './anuncio-intercambio.page.html',
  styleUrls: ['./anuncio-intercambio.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    NgIf,
    BtnContactarComponent,
    AnuncioComponenteComponent,
    AnuncioIntercambioComponent
  ]
})
export class AnuncioIntercambioPage implements OnInit {
  idProducto!: string;

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private productoFormService = inject(ProductoFormService);
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
      }
    });
  }

  getPrimeraImagen(): string {
    return this.producto()?.imagenes?.[0]?.urlImg
      || 'assets/icon/card-media.png';
  }

  volver() {
    if (!this.producto()?.id) return;
    this.cargarProducto(String(this.producto()?.id))
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
  //   const productoId = productoActualizado.id;
  //
  //   // 1 Verificación de ID
  //   if (!productoId) {
  //     console.error('ERROR: No se pudo obtener el ID del producto para actualizar.');
  //     this.mostrarToast('Error interno: ID del producto no encontrado.');
  //     return;
  //   }
  //
  //   // --- VALIDACIONES ---
  //   if (!productoActualizado.titulo) {
  //     this.mostrarToast('El título es obligatorio.');
  //     return;
  //   }
  //   if (!productoActualizado.categoria) {
  //     this.mostrarToast('La categoría es obligatoria.');
  //     return;
  //   }
  //   if (!productoActualizado.tipo || (productoActualizado.tipo !== 'intercambio' && productoActualizado.tipo !== 'prestamo')) {
  //     this.mostrarToast('Debes seleccionar un tipo de oferta válido.');
  //     return;
  //   }
  //   if (!productoActualizado.talla) {
  //     this.mostrarToast('La talla es obligatoria.');
  //     return;
  //   }
  //   if (!productoActualizado.estado) {
  //     this.mostrarToast('El estado es obligatorio.');
  //     return;
  //   }
  //
  //   // Validación específica para 'prestamo'
  //   if (productoActualizado.tipo === 'prestamo') {
  //     if (!productoActualizado.precio) {
  //       this.mostrarToast('El precio por día es obligatorio para un préstamo.');
  //       return;
  //     }
  //     if (!productoActualizado.fechaDevolucion) {
  //       this.mostrarToast('La fecha de devolución es obligatoria para un préstamo.');
  //       return;
  //     }
  //   }
  //
  //   // --- FORMATEO DE FECHA ---
  //   if (productoActualizado.fechaDevolucion) {
  //     const fechaSQL = this.productoFormService.formatIsoToSqlDatetime(productoActualizado.fechaDevolucion);
  //     productoActualizado.fechaDevolucion = fechaSQL;
  //   }
  //
  //   // --- Formateo local de estilos ---
  //   const listaEstilos = productoActualizado.estilo
  //     ? productoActualizado.estilo.split(',').map((e: string) => e.trim())
  //     : [];
  //   this.estilos.set(listaEstilos);
  //
  //   // --- Actualización del producto sin tocar imagen ---
  //   this.productoService.updateProducto(productoId, productoActualizado).subscribe({
  //     next: () => {
  //       console.log('Producto actualizado correctamente');
  //       this.producto.set(productoActualizado);
  //       this.modoEdicion.set(false);
  //       this.cargarProducto(String(productoId));
  //       this.mostrarToast(' Anuncio actualizado correctamente.');
  //     },
  //     error: (err) => {
  //       console.error('Error al guardar los cambios en el servidor:', err);
  //       this.mostrarAlertaErrorGuardado();
  //     }
  //   });
   }


  onCancelar() {
    this.modoEdicion.set(false);
    if (!this.producto()?.id) return;
    this.cargarProducto(String(this.producto()?.id));
  }

}
