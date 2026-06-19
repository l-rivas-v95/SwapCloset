import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NgIf, DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";
import {Subscription} from "rxjs";
import {OverlayService} from "../../../service/overlay/overlay.service";
import {FechaDevolucionModalComponent} from "../../fecha-devolucion-modal/fecha-devolucion-modal.component";

@Component({
    selector: 'app-tipo-oferta',
    templateUrl: './tipo-oferta.component.html',
    styleUrls: ['./tipo-oferta.component.scss'],
    standalone: true,
    imports: [IonicModule, NgIf, FormsModule, DatePipe]
})
export class TipoOfertaComponent implements OnInit, OnDestroy {

  tipoOferta: string = 'intercambio';
  precio: number | null = null;
  fechaDevolucion: string | null = null;

  private formService = inject(ProductoFormService);
  private overlayService = inject(OverlayService);
  private resetSub?: Subscription;

  ngOnInit() {
    this.resetSub = this.formService.reset$.subscribe(() => this.limpiarCampos());
  }

  ngOnDestroy() {
    this.resetSub?.unsubscribe();
  }

  seleccionarTipo(valor: 'intercambio' | 'prestamo') {
    this.onTipoOfertaChange({ detail: { value: valor } });
  }

  onTipoOfertaChange(event: any) {
    const valor = event.detail.value as 'intercambio' | 'prestamo';
    this.tipoOferta = valor;
    this.formService.updateForm({ tipoOferta: valor });

    if (valor === 'prestamo') {
      this.formService.updateForm({ precio: this.precio });
    } else {
      this.precio = null;
      this.fechaDevolucion = null;
      this.formService.updateForm({ precio: null, fechaDevolucion: '' });
    }
  }

  onPrecioChange(event: any) {
    const valor = Number(event.target.value);
    this.precio = valor;
    this.formService.updateForm({ precio: valor });
  }

  abrirFechaModal() {
    this.overlayService.open(FechaDevolucionModalComponent, {}, (fecha: string | null) => {
      if (!fecha) return;
      this.fechaDevolucion = fecha;
      this.formService.updateForm({ fechaDevolucion: fecha });
    });
  }

  private limpiarCampos() {
    this.tipoOferta = 'intercambio';
    this.precio = null;
    this.fechaDevolucion = null;
  }
}
