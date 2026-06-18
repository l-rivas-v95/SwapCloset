import { Component, Input, inject } from '@angular/core';
import { OverlayService } from '../../service/overlay/overlay.service';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss'],
  standalone: true,
  imports: []
})
export class BottomSheetComponent {
  @Input() header = '';
  @Input() options: string[] = [];

  private overlayService = inject(OverlayService);

  seleccionar(op: string) {
    this.overlayService.close(op);
  }

  cancelar() {
    this.overlayService.close(null);
  }
}
