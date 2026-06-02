import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-date-modal-component',
  templateUrl: './date-modal-component.component.html',
  styleUrls: ['./date-modal-component.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class DateModalComponentComponent  implements OnInit {

  @Input() currentDate: string | undefined;
  selectedDate: string | undefined;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.selectedDate = this.currentDate || new Date().toISOString();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    this.modalCtrl.dismiss(this.selectedDate);
  }
}
