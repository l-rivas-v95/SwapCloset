import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {CartaProductoDTO} from "../../modelos/CartaProductoDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/productos'; //

  getProducto(id: number): Observable<ProductoDTO> {
    return this.http.get<ProductoDTO>(`${this.apiUrl}/${id}`)
  }
  getAllProductos(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(this.apiUrl);
  }
  getProductosByUsuario(usuarioId: number): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
  getDisponibles(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.apiUrl}/disponibles`);
  }

  subirFoto(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/guardar`, formData);
  }

  guardarProducto(producto: ProductoDTO): Observable<ProductoDTO> {
    return this.http.post<ProductoDTO>(`${this.apiUrl}`, producto);
  }

  //CARTAS PRODUCTOS
  getCartaProductoById(id: number): Observable<CartaProductoDTO> {
    return this.http.get<CartaProductoDTO>(`${this.apiUrl}/carta-producto/${id}`);
  }

  getAllCartasProductosActivos(): Observable<CartaProductoDTO[]> {
    return this.http.get<CartaProductoDTO[]>(`${this.apiUrl}/carta-producto/all-activos`);
  }

  getAllCartasProductosActivosAndIdUsuario(idUsuario: number): Observable<CartaProductoDTO[]> {
    return this.http.get<CartaProductoDTO[]>(`${this.apiUrl}/carta-producto-activos/${idUsuario}`);
  }

  updateProducto(id: number, producto: ProductoDTO): Observable<ProductoDTO> {
    return this.http.put<ProductoDTO>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
