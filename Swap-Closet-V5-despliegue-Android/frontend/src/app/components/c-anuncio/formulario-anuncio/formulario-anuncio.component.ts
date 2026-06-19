import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {
  ActionSheetButton,
  IonicModule,
  NavController
} from "@ionic/angular";
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {DatePipe, LowerCasePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ModalFotosComponent} from "../../c-publicar/subir-foto/modal-fotos/modal-fotos.component";
import {FechaDevolucionModalComponent} from "../../fecha-devolucion-modal/fecha-devolucion-modal.component";

import {ImagenProductoService} from "../../../service/imagenProductoService/imagen-producto.service";
import {ImagenProductoDTO} from "../../../modelos/ImagenProductoDTO";
import {firstValueFrom} from "rxjs";
import {ImagenFormService} from "../../../service/imagenFormService/imagen-form.service";
import {ProductoService} from "../../../service/productoService/producto.service";
import {OverlayService} from "../../../service/overlay/overlay.service";

@Component({
  selector: 'app-formulario-anuncio',
  templateUrl: './formulario-anuncio.component.html',
  styleUrls: ['./formulario-anuncio.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    RouterLink,
    FormsModule,
    NgClass,
    NgIf,
    LowerCasePipe,
    DatePipe,
    RouterModule
  ]
})
export class FormularioAnuncioComponent {

  @Input() producto!: any;
  @Input() usuario!: any;
  @Input() primeraImagen: string = '';
  @Input() idUsuarioLogueado!: number | null;

  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  estilosSeleccionados: string[] = [];
  estilosExtra = ['Vintage', 'Boho', 'Elegante', 'Minimal', 'Sport'];

  tallasNumero = ['36', '37', '38', '39', '40', '41', '42', '43', '44'];
  tallasDisponibles = ['XS','S','M','L','XL'];
  estadosDisponibles = ['Nuevo','Como nuevo','Bueno','Aceptable'];
  coloresDisponibles = ['Negro','Blanco','Rojo','Azul'];
  categoriasDisponibles = ['Vestido', 'Top', 'Pantalón', 'Chaqueta', 'Calzado', 'Accesorios', 'Abrigo', 'Falda', 'Sudadera', 'Camisa', 'Jersey'];

  nuevaRutaImagen: string | null = null;
  imagenCambiada = false;

  asOpen = false;
  asHeader = '';
  asButtons: any[] = [];

  private imagenProductoService = inject(ImagenProductoService);
  private imagenFormService = inject(ImagenFormService);
  private navCtrl = inject(NavController);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private toast = inject(NativeToastService);
  private overlayService = inject(OverlayService);

  constructor() {
    effect(() => {
      const p = this.producto;
      if (!p?.estilo) return;
      this.estilosSeleccionados = p.estilo
        .split(',')
        .map((e: string) => e.trim())
        .filter((e: string) => e.length > 0);
    });
  }

  getImagenEdicion(): string {
    return this.primeraImagen || 'assets/icon/card-media.png';
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/icon/card-media.png';
  }

  cambiarFoto() {
    this.overlayService.open(ModalFotosComponent, {}, async (data) => {
      if (!data?.rutas) return;
      const ruta = data.rutas[0] ?? data.ruta;
      if (!ruta || !this.producto?.id) return;
      this.primeraImagen = ruta;
      try {
        const imagenes = await firstValueFrom(this.imagenProductoService.getImagenesByProducto(this.producto.id));
        const imagenPrincipal = imagenes.find((img: any) => img.orden === 1);
        if (!imagenPrincipal?.id) throw new Error('No se encontró imagen principal');
        const dto: ImagenProductoDTO = { urlImg: ruta, orden: 1, idProducto: this.producto.id };
        await firstValueFrom(this.imagenProductoService.updateImagenProducto(imagenPrincipal.id, dto));
      } catch (error) {
        console.error('Error al actualizar la imagen principal:', error);
      }
    });
  }

  async obtenerIdPrimerImagen(productoId: number): Promise<number> {
    const imagenes = await this.imagenProductoService.getImagenesByProducto(productoId).toPromise();
    if (!imagenes || imagenes.length === 0) throw new Error('No se encontraron imágenes para este producto');
    const primeraImagen = imagenes[0];
    if (!primeraImagen.id) throw new Error('La primera imagen no tiene un ID válido');
    return primeraImagen.id;
  }

  async guardarCambios() {
    try {
      if (!this.producto) { this.toast.show('Error interno: producto no definido'); return; }
      if (!this.producto.titulo || !this.producto.categoria || !this.producto.tipo) {
        this.toast.show('Debes completar título, categoría y tipo de oferta'); return;
      }
      if (this.producto.tipo !== 'intercambio' && this.producto.tipo !== 'prestamo') {
        this.toast.show('Debes seleccionar un tipo de oferta válido.'); return;
      }
      if (this.producto.tipo.toLowerCase() === 'prestamo') {
        if (this.producto.precio == null || this.producto.fechaDevolucion == null) {
          this.toast.show('Precio y fecha de devolución obligatorios para préstamos'); return;
        }
      }
      if (!this.primeraImagen) { this.toast.show('Debes seleccionar una imagen principal'); return; }
      this.producto.estilo = this.estilosSeleccionados.length > 0 ? this.estilosSeleccionados.join(', ') : null;
      if (!this.producto.id) { this.toast.show('Error interno: producto sin ID'); return; }

      await firstValueFrom(this.productoService.updateProducto(this.producto.id, this.producto));
      const imagenes = await firstValueFrom(this.imagenProductoService.getImagenesByProducto(this.producto.id));
      const imagenPrincipal = imagenes.find(img => img.orden === 1);
      if (imagenPrincipal?.id) {
        const dto: ImagenProductoDTO = { urlImg: this.primeraImagen, orden: 1, idProducto: this.producto.id };
        await firstValueFrom(this.imagenProductoService.updateImagenProducto(imagenPrincipal.id, dto));
      }
      this.toast.show('Producto guardado correctamente');
      this.guardar.emit(this.producto);
    } catch (error) {
      console.error('Error al guardar cambios del producto:', error);
      this.toast.show('Error al guardar el producto');
    }
  }

  cancelarEdicion() { this.cancelar.emit(); }

  agregarEstilo() {
    this.asHeader = 'Añadir estilo';
    this.asButtons = [
      ...this.estilosExtra.map(est => ({
        text: est,
        handler: () => { if (!this.estilosSeleccionados.includes(est)) this.estilosSeleccionados.push(est); }
      })),
      { text: 'Cancelar', role: 'cancel' }
    ];
    this.asOpen = true;
  }

  eliminarEstilo(est: string) {
    this.estilosSeleccionados = this.estilosSeleccionados.filter(e => e !== est);
  }

  seleccionarTalla() {
    let opciones = this.tallasDisponibles;
    if (this.producto?.categoria?.toLowerCase() === 'calzado' || this.producto?.categoria?.toLowerCase() === 'pantalón') {
      opciones = this.tallasNumero;
    }
    this.asHeader = 'Selecciona talla';
    this.asButtons = [
      ...opciones.map(t => ({ text: t, handler: () => { this.producto.talla = t; } })),
      { text: 'Cancelar', role: 'cancel' }
    ];
    this.asOpen = true;
  }

  seleccionarEstado() {
    this.asHeader = 'Selecciona estado';
    this.asButtons = [...this.estadosDisponibles.map(e => ({ text: e, handler: () => { this.producto.estado = e; } })), { text: 'Cancelar', role: 'cancel' }];
    this.asOpen = true;
  }

  seleccionarColor() {
    this.asHeader = 'Selecciona color';
    this.asButtons = [...this.coloresDisponibles.map(c => ({ text: c, handler: () => { this.producto.color = c; } })), { text: 'Cancelar', role: 'cancel' }];
    this.asOpen = true;
  }

  seleccionarCategoria() {
    this.asHeader = 'Selecciona categoría';
    this.asButtons = [...this.categoriasDisponibles.map(c => ({ text: c, handler: () => { this.producto.categoria = c; } })), { text: 'Cancelar', role: 'cancel' }];
    this.asOpen = true;
  }

  abrirFechaModal() {
    this.overlayService.open(
      FechaDevolucionModalComponent,
      { initialDate: this.producto?.fechaDevolucion ?? '' },
      (data) => { if (data) { this.producto.fechaDevolucion = data; } }
    );
  }

  seleccionarTipoOferta() {
    this.asHeader = 'Selecciona el Tipo de Oferta';
    this.asButtons = [
      { text: 'Intercambio', handler: () => { this.producto.tipo = 'intercambio'; this.producto.precio = null; } },
      { text: 'Préstamo', handler: () => { this.producto.tipo = 'prestamo'; } },
      { text: 'Cancelar', role: 'cancel' }
    ];
    this.asOpen = true;
  }
}
