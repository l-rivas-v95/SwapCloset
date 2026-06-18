import {Component, inject, Input} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {OverlayService} from "../../service/overlay/overlay.service";

@Component({
  selector: 'app-fecha-devolucion-modal',
  template: `
    <div style="padding:16px">
      <ion-datetime
        presentation="date-time"
        [(ngModel)]="fecha"
        [showDefaultButtons]="true"
        (ionCancel)="dismiss()"
        (ionChange)="confirm($event)">
      </ion-datetime>
    </div>
  `,
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class FechaDevolucionModalComponent {
  @Input() initialDate: string = '';

  private overlayService = inject(OverlayService);

  fecha: string = this.initialDate || new Date().toISOString();

  dismiss() { this.overlayService.close(null); }

  confirm(event: any) {
    const val = event?.detail?.value ?? this.fecha;
    this.overlayService.close(val);
  }
}
