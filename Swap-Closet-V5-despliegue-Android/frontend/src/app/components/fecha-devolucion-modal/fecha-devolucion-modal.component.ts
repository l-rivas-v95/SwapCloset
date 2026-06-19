import {Component, inject, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {OverlayService} from "../../service/overlay/overlay.service";

@Component({
  selector: 'app-fecha-devolucion-modal',
  templateUrl: './fecha-devolucion-modal.component.html',
  styleUrls: ['./fecha-devolucion-modal.component.scss'],
  standalone: true,
  imports: []
})
export class FechaDevolucionModalComponent implements AfterViewInit {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  private overlayService = inject(OverlayService);

  ngAfterViewInit() {
    // Abre el picker nativo directamente al montar el componente
    setTimeout(() => this.dateInput.nativeElement.showPicker(), 100);
  }

  onChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (val) {
      this.overlayService.close(val);
    }
  }

  cancelar() {
    this.overlayService.close(null);
  }
}
