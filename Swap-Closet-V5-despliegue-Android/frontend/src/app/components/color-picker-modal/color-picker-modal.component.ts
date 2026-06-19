import { Component, inject } from '@angular/core';
import { OverlayService } from '../../service/overlay/overlay.service';

@Component({
  selector: 'app-color-picker-modal',
  templateUrl: './color-picker-modal.component.html',
  styleUrls: ['./color-picker-modal.component.scss'],
  standalone: true,
  imports: []
})
export class ColorPickerModalComponent {
  private overlayService = inject(OverlayService);
  seleccionar(op: string) { this.overlayService.close(op); }
  cancelar() { this.overlayService.close(null); }
}
