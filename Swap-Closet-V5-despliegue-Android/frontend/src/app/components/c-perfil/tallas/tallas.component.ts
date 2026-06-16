import {Component, EventEmitter, inject, Input, Output, Signal} from '@angular/core';
import {IonicModule, ActionSheetController, ToastController} from '@ionic/angular';
import {NgIf} from '@angular/common';
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";

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

  private usuarioService = inject(UsuarioService);
  private toastCtrl = inject(ToastController);

  constructor(private actionSheetCtrl: ActionSheetController) {}

  async elegirTalla(tipo: 'tCamiseta' | 'tPantalon' | 'tCalzado') {
    if (!this.esMiPerfil) return;

    let opciones: string[] = [];

    if (tipo === 'tCamiseta') opciones = ['XS', 'S', 'M', 'L', 'XL'];
    if (tipo === 'tPantalon') opciones = ['38', '40', '42', '44', '46'];
    if (tipo === 'tCalzado') opciones = ['36', '37', '38', '39', '40', '41', '42'];

    const botones = opciones.map(talla => ({
      text: talla,
      handler: () => this.guardarTalla(tipo, talla)
    }));

    const actionSheet = await this.actionSheetCtrl.create({
      header: `Selecciona talla`,
      buttons: [...botones, {text: 'Cancelar', role: 'cancel'}]
    });

    await actionSheet.present();
  }

  private guardarTalla(tipo: 'tCamiseta' | 'tPantalon' | 'tCalzado', talla: string) {
    const u = this.usuario();
    if (!u?.id) return;

    const valor = tipo === 'tCamiseta' ? talla : Number(talla);
    const actualizado = {...u, [tipo]: valor};

    this.usuarioService.updateUsuario(u.id, actualizado).subscribe({
      next: async (usuarioGuardado) => {
        this.usuarioChange.emit(usuarioGuardado);
        await this.mostrarToast('Talla guardada');
      },
      error: async () => await this.mostrarToast('Error al guardar talla')
    });
  }

  private async mostrarToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
