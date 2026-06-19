import { Component, inject } from '@angular/core';
import { OverlayService } from '../../service/overlay/overlay.service';

@Component({
  selector: 'app-categoria-picker-modal',
  templateUrl: './categoria-picker-modal.component.html',
  styleUrls: ['./categoria-picker-modal.component.scss'],
  standalone: true,
  imports: []
})
export class CategoriaPickerModalComponent {
  private overlayService = inject(OverlayService);
  seleccionar(op: string) { this.overlayService.close(op); }
  cancelar() { this.overlayService.close(null); }
}
