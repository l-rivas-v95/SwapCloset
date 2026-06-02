import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RaitingDTO} from "../../modelos/RaitingDTO";
import {ProductoHistoricoDTO} from "../../modelos/ProductoHistoricoDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductoHistoricoService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/productos-historico'; //

  getProductoHistorico(id: number): Observable<ProductoHistoricoDTO> {
    return this.http.get<ProductoHistoricoDTO>(`${this.apiUrl}/${id}`)
  }
}
