import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-descripcion-producto',
  templateUrl: './descripcion-producto.component.html',
  styleUrls: ['./descripcion-producto.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class DescripcionProductoComponent implements OnInit, OnDestroy {

  titulo: string = '';
  marca: string = '';
  descripcion: string = '';

  private formService = inject(ProductoFormService);
  private resetSub?: Subscription;

  ngOnInit() {
    this.resetSub = this.formService.reset$.subscribe(() => this.limpiarCampos());
  }

  ngOnDestroy() {
    this.resetSub?.unsubscribe();
  }

  onTituloChange(value: string) {
    this.titulo = value;
    this.formService.updateForm({ titulo: value });
  }

  onMarcaChange(value: string) {
    this.marca = value;
    this.formService.updateForm({ marca: value });
  }

  onDescripcionChange(value: string) {
    this.descripcion = value;
    this.formService.updateForm({ descripcion: value });
  }

  private limpiarCampos() {
    this.titulo = '';
    this.marca = '';
    this.descripcion = '';
  }
}
