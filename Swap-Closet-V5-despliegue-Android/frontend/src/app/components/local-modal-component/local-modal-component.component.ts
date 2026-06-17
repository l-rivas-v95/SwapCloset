import {Component, inject} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-local-modal-component',
  templateUrl: './local-modal-component.component.html',
  styleUrls: ['./local-modal-component.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LocalModalComponentComponent {

  searchQuery = '';
  mapUrl: SafeResourceUrl | null = null;
  buscado = false;

  private modalCtrl = inject(ModalController);
  private sanitizer = inject(DomSanitizer);

  buscar() {
    if (!this.searchQuery.trim()) return;
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(this.searchQuery)}&output=embed&z=15`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.buscado = true;
  }

  dismiss() {
    this.modalCtrl.dismiss(null);
  }

  confirm() {
    if (this.searchQuery.trim()) {
      this.modalCtrl.dismiss(this.searchQuery.trim());
    }
  }
}
