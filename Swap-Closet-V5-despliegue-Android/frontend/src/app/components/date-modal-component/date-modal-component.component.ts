import {Component, inject, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-date-modal-component',
  templateUrl: './date-modal-component.component.html',
  styleUrls: ['./date-modal-component.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class DateModalComponentComponent implements OnInit {

  @Input() currentDate: string | undefined;
  selectedDate: string = new Date().toISOString();

  // Mínimo: ahora mismo
  minDate = new Date().toISOString();

  private modalCtrl = inject(ModalController);

  ngOnInit() {
    this.selectedDate = this.currentDate || new Date().toISOString();
  }

  dismiss() {
    this.modalCtrl.dismiss(null);
  }

  confirm() {
    // Devuelve formato yyyy-MM-ddTHH:mm:ss
    const d = new Date(this.selectedDate);
    const iso = d.getFullYear() + '-'
      + String(d.getMonth() + 1).padStart(2, '0') + '-'
      + String(d.getDate()).padStart(2, '0') + 'T'
      + String(d.getHours()).padStart(2, '0') + ':'
      + String(d.getMinutes()).padStart(2, '0') + ':00';
    this.modalCtrl.dismiss(iso);
  }
}
