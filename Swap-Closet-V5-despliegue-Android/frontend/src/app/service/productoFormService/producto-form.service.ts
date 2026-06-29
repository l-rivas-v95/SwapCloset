import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ProductoForm} from "../../modelos/ProductoForm";
import {ProductoDTO} from "../../modelos/ProductoDTO";

@Injectable({
  providedIn: 'root'
})
export class ProductoFormService {

  imagenesPerfil: string[] = [
    'assets/img/usuarios/img-perfil.png',
    'assets/img/usuarios/img-perfil-2.png',
    'assets/img/usuarios/img-perfil-3.png',
    'assets/img/usuarios/img-perfil-4.png',
    'assets/img/usuarios/img-perfil-5.png',
    'assets/img/usuarios/img-perfil-5.png',
    'assets/img/usuarios/img-perfil-7.png',
    'assets/img/usuarios/img-perfil-8.png',
    'assets/img/usuarios/img-perfil-9.png',
    'assets/img/usuarios/img-perfil-10.png',
  ]

  private readonly formInicial: ProductoForm = {
    tipoOferta: 'intercambio',
    precio: null,
    fechaDevolucion: "",
    titulo: '',
    marca: '',
    descripcion: '',
    categoria: '',
    estado: '',
    talla: '',
    color: '',
    estilo: ''
  };

  private form: ProductoForm = {...this.formInicial};
  private resetSubject = new BehaviorSubject<number>(0);
  reset$ = this.resetSubject.asObservable();

  getForm(): ProductoForm {
    return this.form;
  }

  updateForm(changes: Partial<ProductoForm>) {
    this.form = { ...this.form, ...changes };
    console.log('Formulario actualizado:', this.form);
  }

  resetForm() {
    this.form = {...this.formInicial};
    this.resetSubject.next(this.resetSubject.value + 1);
    console.log('Formulario reseteado.');
  }

  convertirAProductoDTO(idUsuario: number): ProductoDTO {
    const fechaFormateada = this.formatIsoToSqlDatetime(this.form.fechaDevolucion);

    return {
      tipo: this.form.tipoOferta ?? '',
      precio: this.form.tipoOferta === 'prestamo'
        ? this.form.precio?.toString() ?? ''
        : undefined,
      titulo: this.form.titulo ?? '',
      estilo: this.form.estilo ?? '',
      descripcion: this.form.descripcion ?? '',
      marca: this.form.marca ?? '',
      estado: this.form.estado ?? '',
      categoria: this.form.categoria ?? '',
      talla: this.form.talla ?? '',
      color: this.form.color ?? '',
      fechaDevolucion: fechaFormateada,
      idUsuario: idUsuario,
      activo: true,
      fechaCreacion: undefined,
      imagenes: undefined,
      favoritos: undefined,
      chatsProducto1: undefined,
      chatsProducto2: undefined
    };
  }

  public formatIsoToSqlDatetime(isoString: string | undefined): string | undefined {
    if (!isoString) {
      return undefined;
    }

    const dateObj = new Date(isoString);

    if (isNaN(dateObj.getTime())) {
      console.error("Error de parseo de fecha:", isoString);
      return undefined;
    }

    const pad = (num: number) => String(num).padStart(2, '0');

    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());

    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());
    const seconds = pad(dateObj.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}
