import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FavoritoDTO} from "../../modelos/FavoritoDTO";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {CartaProductoDTO} from "../../modelos/CartaProductoDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/favoritos';

  getFavorito(id: number): Observable<FavoritoDTO> {
    return this.http.get<FavoritoDTO>(`${this.apiUrl}/${id}`)
  }

  getFavoritosByUsuario(idUsuario: number): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.apiUrl}/usuario/${idUsuario}/productos`);
  }

  getCartProductoFavoritosByUsuario(idUsuario: number): Observable<CartaProductoDTO[]> {
    return this.http.get<CartaProductoDTO[]>(`${this.apiUrl}carta-productos-favoritos/${idUsuario}`);
  }

  getCountFavoritos(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuario/${idUsuario}/count`);
  }

  saveFavorito(favoritoDto: FavoritoDTO): Observable<FavoritoDTO> {
    return this.http.post<FavoritoDTO>(this.apiUrl, favoritoDto);
  }

  deleteFavorito(idUsuario: number, idProducto: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idUsuario}/${idProducto}`);
  }

  isFavorito(idUsuario: number, idProducto: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${idUsuario}/${idProducto}`);
  }

}
