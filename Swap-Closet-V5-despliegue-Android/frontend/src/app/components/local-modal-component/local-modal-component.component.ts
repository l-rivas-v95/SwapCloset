import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-local-modal-component',
  templateUrl: './local-modal-component.component.html',
  styleUrls: ['./local-modal-component.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LocalModalComponentComponent  implements OnInit {

  searchQuery: string = '';
  selectedLocation: string = '';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

  selectLocation(location: string) {
    this.selectedLocation = location;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    if (this.selectedLocation) {
      this.modalCtrl.dismiss(this.selectedLocation);
    }
  }

}
