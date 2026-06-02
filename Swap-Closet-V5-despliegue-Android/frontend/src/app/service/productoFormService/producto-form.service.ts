import { Injectable } from '@angular/core';
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

  private form: ProductoForm = {
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

  getForm(): ProductoForm {
    return this.form;
  }

  updateForm(changes: Partial<ProductoForm>) {
    this.form = { ...this.form, ...changes };
    console.log('Formulario actualizado:', this.form);
  }

  resetForm() {
    this.form = {
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
    console.log('Formulario reseteado.');
  }

  convertirAProductoDTO(idUsuario: number): ProductoDTO {
    const fechaFormateada = this.formatIsoToSqlDatetime(this.form.fechaDevolucion);

    return {
      tipo: this.form.tipoOferta ?? '',
      precio: this.form.tipoOferta === 'prestamo'
        ? this.form.precio?.toString() ?? ''
        : undefined,   // <-- undefined para intercambios
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
      chatProducto1: undefined,
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

    // Usamos métodos locales para respetar la hora seleccionada por el usuario.
    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());

    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());
    const seconds = pad(dateObj.getSeconds());

    // Formato final deseado: YYYY-MM-DDT HH:MM:SS
    // Usamos 'T' como separador de fecha y hora.
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}
