import {Component, effect, EventEmitter, inject, Input, OnInit, Output, signal, ViewChild} from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  IonicModule,
  IonModal,
  ModalController,
  NavController, ToastController
} from "@ionic/angular";
import {DatePipe, LowerCasePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ModalFotosComponent} from "../../c-publicar/subir-foto/modal-fotos/modal-fotos.component";
import {ImagenProductoService} from "../../../service/imagenProductoService/imagen-producto.service";
import {ImagenProductoDTO} from "../../../modelos/ImagenProductoDTO";
import {firstValueFrom, map, Observable} from "rxjs";
import {ImagenFormService} from "../../../service/imagenFormService/imagen-form.service";
import {ProductoService} from "../../../service/productoService/producto.service";

@Component({
  selector: 'app-anuncio-intercambio',
  templateUrl: './anuncio-intercambio.component.html',
  styleUrls: ['./anuncio-intercambio.component.scss'],
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
export class AnuncioIntercambioComponent {

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

  // Nueva propiedad para almacenar la ruta de la imagen seleccionada del modal
  nuevaRutaImagen: string | null = null;
  imagenCambiada = false;


  @ViewChild('modalFecha', { static: false }) modalFecha!: IonModal;

  // Inyectamos el ModalController usando inject()
  private actionSheetCtrl = inject(ActionSheetController);
  private modalCtrl = inject(ModalController);
  private imagenProductoService = inject(ImagenProductoService)
  private imagenFormService = inject(ImagenFormService);
  private navCtrl = inject(NavController)
  private router = inject(Router);
  private productoService = inject(ProductoService)
  private toastCtrl = inject(ToastController)

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

  async cambiarFoto() {
    const modal = await this.modalCtrl.create({
      component: ModalFotosComponent,
      cssClass: 'modal-galeria'
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data?.ruta || !this.producto?.id) return;

    // 1️⃣ Actualizar UI inmediatamente
    this.primeraImagen = data.ruta;

    try {
      // 2️⃣ Obtener la imagen existente con orden = 1
      const imagenes = await firstValueFrom(
        this.imagenProductoService.getImagenesByProducto(this.producto.id)
      );

      const imagenPrincipal = imagenes.find(img => img.orden === 1);
      if (!imagenPrincipal?.id) {
        throw new Error('No se encontró imagen principal con orden 1');
      }

      // 3️⃣ DTO fijo
      const dto: ImagenProductoDTO = {
        urlImg: data.ruta,
        orden: 1,
        idProducto: this.producto.id
      };

      // 4️⃣ Actualizar imagen principal en backend
      await firstValueFrom(
        this.imagenProductoService.updateImagenProducto(imagenPrincipal.id, dto)
      );

      console.log('Imagen principal actualizada correctamente');

    } catch (error) {
      console.error('Error al actualizar la imagen principal:', error);
    }
  }

  async obtenerIdPrimerImagen(productoId: number): Promise<number> {
    const imagenes = await this.imagenProductoService.getImagenesByProducto(productoId).toPromise();
    if (!imagenes || imagenes.length === 0) {
      throw new Error('No se encontraron imágenes para este producto');
    }

    // Coger la primera imagen de la lista
    const primeraImagen = imagenes[0];

    if (!primeraImagen.id) {
      throw new Error('La primera imagen no tiene un ID válido');
    }

    return primeraImagen.id;
  }
  async guardarCambios() {
    try {
      if (!this.producto) {
        console.error('Producto no definido');
        await this.mostrarToast('Error interno: producto no definido');
        return;
      }

      // --- VALIDACIONES BÁSICAS ---
      if (!this.producto.titulo || !this.producto.categoria || !this.producto.tipo) {
        await this.mostrarToast('Debes completar título, categoría y tipo de oferta');
        return;
      }

      if (!this.producto.tipo || (this.producto.tipo !== 'intercambio' && this.producto.tipo !== 'prestamo')) {
           await this.mostrarToast('Debes seleccionar un tipo de oferta válido.');
           return;
      }

      // Validación específica de préstamo
      if (this.producto.tipo.toLowerCase() === 'prestamo') {
        if (this.producto.precio == null || this.producto.fechaDevolucion == null) {
          await this.mostrarToast('Precio y fecha de devolución obligatorios para préstamos');
          return;
        }
      }

      // Validación imagen principal
      if (!this.primeraImagen) {
        await this.mostrarToast('Debes seleccionar una imagen principal');
        return;
      }

      // --- ACTUALIZAR CAMPOS DEL PRODUCTO ---
      this.producto.estilo = this.estilosSeleccionados.length > 0
        ? this.estilosSeleccionados.join(', ')
        : null;

      // --- GUARDAR PRODUCTO EN BACKEND ---
      if (!this.producto.id) {
        console.error('Producto sin ID');
        await this.mostrarToast('Error interno: producto sin ID');
        return;
      }

      await firstValueFrom(
        this.productoService.updateProducto(this.producto.id, this.producto)
      );
      console.log('Producto actualizado correctamente');

      // --- ACTUALIZAR IMAGEN PRINCIPAL ---
      const imagenes = await firstValueFrom(
        this.imagenProductoService.getImagenesByProducto(this.producto.id)
      );

      const imagenPrincipal = imagenes.find(img => img.orden === 1);
      if (imagenPrincipal?.id) {
        const dto: ImagenProductoDTO = {
          urlImg: this.primeraImagen,
          orden: 1,
          idProducto: this.producto.id
        };

        await firstValueFrom(
          this.imagenProductoService.updateImagenProducto(imagenPrincipal.id, dto)
        );
        console.log('Imagen principal actualizada correctamente');
      } else {
        console.warn('No se encontró imagen principal para actualizar');
      }

      // --- REDIRECCIÓN Y MENSAJE ---
      await this.mostrarToast('Producto guardado correctamente');
      this.cancelar.emit();

    } catch (error) {
      console.error('Error al guardar cambios del producto:', error);
      await this.mostrarToast('Error al guardar el producto');
    }
  }

  async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
  cancelarEdicion() {
    this.cancelar.emit();
  }

  // --- ESTILOS ---
  async agregarEstilo() {
    const botones: ActionSheetButton[] = this.estilosExtra.map(est => ({
      text: est,
      handler: () => {
        if (!this.estilosSeleccionados.includes(est)) {
          this.estilosSeleccionados.push(est);
        }
      }
    }));
    botones.push({ text: 'Cancelar', role: 'cancel' });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Añadir estilo',
      buttons: botones
    });
    await actionSheet.present();
  }

  eliminarEstilo(est: string) {
    this.estilosSeleccionados = this.estilosSeleccionados.filter(e => e !== est);
  }


  async seleccionarTalla() {
    if (!this.producto?.categoria) {
      console.warn('No hay categoría seleccionada');
      return;
    }

    // Elegir el tipo de tallas según categoría
    let opcionesTallas: string[] = this.tallasDisponibles; // por defecto

    if (this.producto.categoria.toLowerCase() === 'calzado' ||
      this.producto.categoria.toLowerCase() === 'pantalón') {
      opcionesTallas = this.tallasNumero;
    }

    // Crear botones del ActionSheet
    const botones: ActionSheetButton[] = opcionesTallas.map(talla => ({
      text: talla,
      handler: () => { this.producto.talla = talla; }
    }));

    botones.push({ text: 'Cancelar', role: 'cancel' });

    // Mostrar ActionSheet
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona talla',
      buttons: botones
    });

    await actionSheet.present();
  }

  async seleccionarEstado() {
    const botones: ActionSheetButton[] = this.estadosDisponibles.map(estado => ({
      text: estado,
      handler: () => { this.producto.estado = estado; }
    }));
    botones.push({ text: 'Cancelar', role: 'cancel' });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona estado',
      buttons: botones
    });
    await actionSheet.present();
  }

  async seleccionarColor() {
    const botones: ActionSheetButton[] = this.coloresDisponibles.map(color => ({
      text: color,
      handler: () => { this.producto.color = color; }
    }));
    botones.push({ text: 'Cancelar', role: 'cancel' });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona color',
      buttons: botones
    });
    await actionSheet.present();
  }

  async seleccionarCategoria() {
    const botones: ActionSheetButton[] = this.categoriasDisponibles.map(cat => ({
      text: cat,
      handler: () => {
        this.producto.categoria = cat;
      }
    }));

    botones.push({ text: 'Cancelar', role: 'cancel' });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona Categoría',
      buttons: botones
    });
    await actionSheet.present();
  }

  // --- MODAL DE FECHA ---
  abrirFechaModal() {
    this.modalFecha.present();
  }

  cerrarFechaModal() {
    this.modalFecha.dismiss();
  }

  async seleccionarTipoOferta() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona el Tipo de Oferta',
      buttons: [
        {
          text: 'Intercambio',
          role: 'intercambio',
          cssClass: this.producto.tipo === 'Intercambio' ? 'selected-option' : '',
          handler: () => {
            this.producto.tipo = 'intercambio';
            // Al cambiar a Intercambio, limpiamos el precio
            this.producto.precio = null;
          }
        },
        {
          text: 'Préstamo',
          role: 'prestamo',
          // El chip será azul
          cssClass: this.producto.tipo === 'Préstamo' ? 'selected-option' : '',
          handler: () => {
            this.producto.tipo = 'prestamo';
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}
