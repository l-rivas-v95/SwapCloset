import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MensajeDTO} from "../../modelos/MensajeDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/mensajes'; //

  getMensaje(id: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.apiUrl}/${id}`)
  }
}
