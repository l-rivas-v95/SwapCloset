import {Component, inject, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {OverlayService} from "../../service/overlay/overlay.service";

@Component({
  selector: 'app-date-modal-component',
  templateUrl: './date-modal-component.component.html',
  styleUrls: ['./date-modal-component.component.scss'],
  standalone: true,
  imports: []
})
export class DateModalComponentComponent implements AfterViewInit {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  private overlayService = inject(OverlayService);

  ngAfterViewInit() {
    setTimeout(() => this.dateInput.nativeElement.showPicker(), 100);
  }

  onChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (!val) return;
    // Convertir "YYYY-MM-DDTHH:MM" a ISO con segundos
    const iso = val.length === 16 ? val + ':00' : val;
    this.overlayService.close(iso);
  }

  dismiss() {
    this.overlayService.close(null);
  }
}
