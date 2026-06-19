import {Component, inject, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {ProductoService} from "../../../service/productoService/producto.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../service/authService/auth.service";
import {CommonModule} from "@angular/common";
import {ImagenProductoDTO} from "../../../modelos/ImagenProductoDTO";
import {ImagenProductoService} from "../../../service/imagenProductoService/imagen-producto.service";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";
import {firstValueFrom} from "rxjs";
import {ImagenFormService} from "../../../service/imagenFormService/imagen-form.service";

@Component({
  selector: 'app-boton-publicar',
  templateUrl: './boton-publicar.component.html',
  styleUrls: ['./boton-publicar.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class BotonPublicarComponent implements OnInit {

  private formService = inject(ProductoFormService);
  private productoService = inject(ProductoService);
  private imagenService = inject(ImagenProductoService);
  private imagenesFormService = inject(ImagenFormService);
  private toast = inject(NativeToastService);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {}

  ngOnInit() {}

  async publicarPrenda() {
    const form = this.formService.getForm();

    try {
      //Validaciones básicas
      if (!form.titulo || !form.tipoOferta || !form.categoria) {
        this.toast.show('Debes completar título, oferta y categoría');
        return;
      }

      // Validación de fecha (obligatoria para todos los tipos)
      if (!form.fechaDevolucion) {
        this.toast.show('Debes seleccionar una fecha de devolución');
        return;
      }

      // Validación específica de préstamos
      if (form.tipoOferta === 'prestamo') {
        if (form.precio == null || form.precio === undefined) {
          this.toast.show('Precio y fecha de devolución obligatorios');
          return;
        }
      }

      // Obtener usuario
      const usuario = this.authService.getUsuario();
      if (!usuario?.id) {
        this.toast.show('Debes iniciar sesión');
        await this.router.navigate(['/login']);
        return;
      }

      // Construir DTO del producto
      const productoDTO = this.formService.convertirAProductoDTO(usuario.id);

      // Guardar el producto en el backend
      const productoCreado = await firstValueFrom(
        this.productoService.guardarProducto(productoDTO)
      );

      if (!productoCreado?.id) {
        throw new Error('El backend no devolvió un ID de producto');
      }

      // Guardar imágenes del producto (solo rutas)
      await this.guardarImagenes(productoCreado.id);

      // Final — primero reset y navegar, luego toast
      this.formService.resetForm();
      this.imagenesFormService.resetFotos();
      this.toast.show('Producto publicado correctamente');
      await this.router.navigate(['/home']);

    } catch (err) {
      console.error('Error durante la publicación del producto:', err);
      this.toast.show('Error al publicar el producto');
    }
  }


  async guardarImagenes(idProducto: number) {
    // 1. Obtener las URLs desde el servicio dedicado a las imágenes
    const fotosUrls: string[] = this.imagenesFormService.getFotos();

    if (!fotosUrls || fotosUrls.length === 0) return;

    try {
      // Iterar sobre las URLs y guardar cada DTO
      for (let i = 0; i < fotosUrls.length; i++) {

        const dto: ImagenProductoDTO = {
          urlImg: fotosUrls[i],
          orden: i + 1,
          idProducto: idProducto
        };

        // Llamada al servicio HTTP para guardar la imagen
        await firstValueFrom(
          this.imagenService.guardarImagenProducto(dto)
        );
      }

      // Limpiar el array de fotos en el servicio de imágenes después del guardado exitoso
      this.imagenesFormService.resetFotos();

    } catch (error) {
      console.error("Error al guardar una imagen asociada:", error);
      throw new Error('Fallo al guardar una o más imágenes.');
    }
  }

}
