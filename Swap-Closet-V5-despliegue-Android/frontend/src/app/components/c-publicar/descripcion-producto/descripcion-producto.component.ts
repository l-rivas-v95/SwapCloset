import {Component, inject, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";

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
export class DescripcionProductoComponent  implements OnInit {

  titulo: string = '';
  marca: string = '';
  descripcion: string = '';

  private formService = inject(ProductoFormService);

  ngOnInit() {}

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

}
