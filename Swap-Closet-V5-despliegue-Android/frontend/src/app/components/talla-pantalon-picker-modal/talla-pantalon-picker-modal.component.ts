import { Component, inject } from '@angular/core';
import { OverlayService } from '../../service/overlay/overlay.service';

@Component({
  selector: 'app-talla-pantalon-picker-modal',
  templateUrl: './talla-pantalon-picker-modal.component.html',
  standalone: true,
  imports: []
})
export class TallaPantalonPickerModalComponent {
  private overlayService = inject(OverlayService);
  seleccionar(t: string) { this.overlayService.close(t); }
  cancelar() { this.overlayService.close(null); }
}
