import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ImagenProductoDTO} from "../../modelos/ImagenProductoDTO";

@Injectable({
  providedIn: 'root'
})
export class ImagenFormService {

  private fotosSubject = new BehaviorSubject<string[]>([]);
  fotos$ = this.fotosSubject.asObservable();

  private fotosSeleccionadas: string[] = [];

  agregarFoto(enlace : string) {
    this.fotosSeleccionadas.push(enlace);
    this.emitirFotos();
  }

  eliminarFoto(enlace: string) {
    this.fotosSeleccionadas = this.fotosSeleccionadas.filter(foto => foto !== enlace);
    this.emitirFotos();
  }

  getFotos(): string[] {
    return this.fotosSeleccionadas;
  }

  resetFotos() {
    this.fotosSeleccionadas = [];
    this.emitirFotos();
  }

  public setImagenUnica(ruta: string) {
    this.fotosSeleccionadas = [ruta];
    this.emitirFotos();
  }

  generarImagenesDTO(idProducto: number): ImagenProductoDTO[] {
    return this.fotosSeleccionadas.map((ruta, index) => ({
      urlImg: ruta,
      orden: index + 1,
      idProducto: idProducto
    }));
  }

  private emitirFotos() {
    this.fotosSubject.next([...this.fotosSeleccionadas]);
  }
}
