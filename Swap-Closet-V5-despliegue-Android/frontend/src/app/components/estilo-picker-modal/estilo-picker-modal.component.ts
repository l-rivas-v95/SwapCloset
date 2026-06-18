import { Component, inject } from '@angular/core';
import { OverlayService } from '../../service/overlay/overlay.service';

@Component({
  selector: 'app-estilo-picker-modal',
  templateUrl: './estilo-picker-modal.component.html',
  styleUrls: ['./estilo-picker-modal.component.scss'],
  standalone: true,
  imports: []
})
export class EstiloPickerModalComponent {
  opciones = ['Vintage', 'Boho', 'Elegante', 'Minimal', 'Sport'];

  private overlayService = inject(OverlayService);

  seleccionar(op: string) {
    this.overlayService.close(op);
  }

  cancelar() {
    this.overlayService.close(null);
  }
}
