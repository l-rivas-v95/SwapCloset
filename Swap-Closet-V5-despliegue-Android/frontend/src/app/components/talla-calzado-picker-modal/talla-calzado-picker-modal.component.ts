import { Component, inject } from '@angular/core';
import { OverlayService } from '../../service/overlay/overlay.service';

@Component({
  selector: 'app-talla-calzado-picker-modal',
  templateUrl: './talla-calzado-picker-modal.component.html',
  standalone: true,
  imports: []
})
export class TallaCalzadoPickerModalComponent {
  private overlayService = inject(OverlayService);
  seleccionar(t: string) { this.overlayService.close(t); }
  cancelar() { this.overlayService.close(null); }
}
