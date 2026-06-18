import { Component, inject } from '@angular/core';
import { OverlayService } from '../../service/overlay/overlay.service';

@Component({
  selector: 'app-talla-camiseta-picker-modal',
  templateUrl: './talla-camiseta-picker-modal.component.html',
  standalone: true,
  imports: []
})
export class TallaCamisetaPickerModalComponent {
  private overlayService = inject(OverlayService);
  seleccionar(t: string) { this.overlayService.close(t); }
  cancelar() { this.overlayService.close(null); }
}
