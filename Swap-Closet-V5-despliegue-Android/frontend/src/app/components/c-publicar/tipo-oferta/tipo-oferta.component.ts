import {Component, inject, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";

@Component({
    selector: 'app-tipo-oferta',
    templateUrl: './tipo-oferta.component.html',
    styleUrls: ['./tipo-oferta.component.scss'],
    standalone: true,
    imports: [
      IonicModule,
      NgIf,
      FormsModule
    ]
})
export class TipoOfertaComponent  implements OnInit {

  tipoOferta: string = 'intercambio';
  precio: number | null = null;
  mostrarCalendario: boolean = false;
  fechaDevolucion: string | null = null;

  private formService = inject(ProductoFormService);

  ngOnInit() {
  }

  onTipoOfertaChange(event: any) {
    const valor = event.detail.value as 'intercambio' | 'prestamo';
    this.tipoOferta = valor;

    this.formService.updateForm({ tipoOferta: valor });

    if (valor === 'prestamo') {
      this.formService.updateForm({ precio: this.precio });
    }
  }

  onPrecioChange(event: any) {
    const valor = Number(event.target.value);
    this.precio = valor;
    this.formService.updateForm({precio: valor});
  }

  toggleCalendario() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  onFechaChange(event: any) {
    this.fechaDevolucion = event.detail.value;
    this.formService.updateForm({fechaDevolucion: this.fechaDevolucion?.toString()});
  }
}
