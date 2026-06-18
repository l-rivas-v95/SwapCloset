import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {DateModalComponentComponent} from "../../date-modal-component/date-modal-component.component";
import {LocalModalComponentComponent} from "../../local-modal-component/local-modal-component.component";
import {CartaChatProductoComponent} from "../../c-chat/carta-chat-producto/carta-chat-producto.component";
import {MensajeFechaComponent} from "../mensaje-fecha/mensaje-fecha.component";
import {MensajeUbicacionComponent} from "../mensaje-ubicacion/mensaje-ubicacion.component";

@Component({
  selector: 'app-mensajes-component',
  templateUrl: './mensajes-component.component.html',
  styleUrls: ['./mensajes-component.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    DateModalComponentComponent,
    LocalModalComponentComponent,
    CartaChatProductoComponent,
    MensajeFechaComponent,
    MensajeUbicacionComponent
  ]
})
export class MensajesComponentComponent  implements OnInit {

  ngOnInit() {}

  newMessage: string = '';
  selectedDate: string = '';
  selectedLocation: string = '';
  isConfirmed: boolean = false;

  // Declarative overlay state
  showDateModal = false;
  showLocationModal = false;
  alertOpen = false;
  alertHeader = '';
  alertMessage = '';
  alertButtons: any[] = [];

  proposeDate() {
    this.showDateModal = true;
  }

  onDateDismiss(event: CustomEvent) {
    this.showDateModal = false;
    const data = (event as any).detail?.data;
    if (data) {
      this.selectedDate = this.formatDate(data);
    }
  }

  proposeLocation() {
    this.showLocationModal = true;
  }

  onLocationDismiss(event: CustomEvent) {
    this.showLocationModal = false;
    const data = (event as any).detail?.data;
    if (data) {
      this.selectedLocation = data;
    }
  }

  confirmExchange() {
    this.alertHeader = 'Confirmar intercambio';
    this.alertMessage = '¿Estás seguro de que quieres confirmar el intercambio?';
    this.alertButtons = [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Confirmar', handler: () => { this.isConfirmed = true; } }
    ];
    this.alertOpen = true;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Lógica para enviar mensaje
      console.log('Mensaje enviado:', this.newMessage);
      this.newMessage = '';
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

}
