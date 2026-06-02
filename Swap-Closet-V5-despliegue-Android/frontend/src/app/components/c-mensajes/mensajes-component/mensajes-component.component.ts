import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule, ModalController} from "@ionic/angular";
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

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private modalCtrl: ModalController,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private alertCtrl: AlertController
  ) {}

  async proposeDate() {
    const modal = await this.modalCtrl.create({
      component: DateModalComponentComponent,
      componentProps: {
        currentDate: this.selectedDate
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedDate = this.formatDate(result.data);
      }
    });

    await modal.present();
  }

  async proposeLocation() {
    const modal = await this.modalCtrl.create({
      component: LocalModalComponentComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedLocation = result.data;
      }
    });

    await modal.present();
  }

  async confirmExchange() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar intercambio',
      message: '¿Estás seguro de que quieres confirmar el intercambio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.isConfirmed = true;
          }
        }
      ]
    });

    await alert.present();
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
