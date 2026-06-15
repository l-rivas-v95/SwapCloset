import {Component, EventEmitter, Input, Output, Signal} from '@angular/core';
import {IonicModule, ActionSheetController} from '@ionic/angular';
import {NgIf} from '@angular/common';
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";

@Component({
  selector: 'app-tallas',
  templateUrl: './tallas.component.html',
  styleUrls: ['./tallas.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class TallasComponent {

  @Input({required: true}) usuario!: Signal<UsuarioDTO | null>;
  @Input() esMiPerfil = true;
  @Output() usuarioChange = new EventEmitter<UsuarioDTO>();

  constructor(private actionSheetCtrl: ActionSheetController) {}

  async elegirTalla(tipo: 'tCamiseta' | 'tPantalon' | 'tCalzado') {
    if (!this.esMiPerfil) return;

    let opciones: string[] = [];

    if (tipo === 'tCamiseta') opciones = ['XS', 'S', 'M', 'L', 'XL'];
    if (tipo === 'tPantalon') opciones = ['38', '40', '42', '44', '46'];
    if (tipo === 'tCalzado') opciones = ['36', '37', '38', '39', '40', '41', '42', '43'];

    const botones = opciones.map(talla => ({
      text: talla,
      handler: () => {
        const u = this.usuario();
        if (!u) return;

        const actualizado = {...u, [tipo]: talla};
        this.usuarioChange.emit(actualizado);
      }
    }));

    const actionSheet = await this.actionSheetCtrl.create({
      header: `Selecciona talla`,
      buttons: [...botones, {text: 'Cancelar', role: 'cancel'}]
    });

    await actionSheet.present();
  }
}
