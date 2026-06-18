import {Component, inject, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {OverlayService} from "../../service/overlay/overlay.service";

@Component({
  selector: 'app-date-modal-component',
  templateUrl: './date-modal-component.component.html',
  styleUrls: ['./date-modal-component.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class DateModalComponentComponent implements OnInit {
  @Input() currentDate: string | undefined;

  private overlayService = inject(OverlayService);

  selectedDate: string = new Date().toISOString();
  minDate = new Date().toISOString();

  ngOnInit() {
    this.selectedDate = this.currentDate || new Date().toISOString();
  }

  dismiss() { this.overlayService.close(null); }

  confirm() {
    const d = new Date(this.selectedDate);
    const iso = d.getFullYear() + '-'
      + String(d.getMonth() + 1).padStart(2, '0') + '-'
      + String(d.getDate()).padStart(2, '0') + 'T'
      + String(d.getHours()).padStart(2, '0') + ':'
      + String(d.getMinutes()).padStart(2, '0') + ':00';
    this.overlayService.close(iso);
  }
}
