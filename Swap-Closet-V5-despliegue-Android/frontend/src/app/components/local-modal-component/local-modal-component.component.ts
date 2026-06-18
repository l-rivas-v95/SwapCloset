import {Component, inject} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {OverlayService} from "../../service/overlay/overlay.service";

@Component({
  selector: 'app-local-modal-component',
  templateUrl: './local-modal-component.component.html',
  styleUrls: ['./local-modal-component.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LocalModalComponentComponent {
  private overlayService = inject(OverlayService);
  private sanitizer = inject(DomSanitizer);

  searchQuery = '';
  mapUrl: SafeResourceUrl | null = null;
  buscado = false;

  buscar() {
    if (!this.searchQuery.trim()) return;
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(this.searchQuery)}&output=embed&z=15`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.buscado = true;
  }

  dismiss() { this.overlayService.close(null); }

  confirm() {
    if (this.searchQuery.trim()) { this.overlayService.close(this.searchQuery.trim()); }
  }
}
