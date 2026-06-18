import {Component, inject, Input, signal} from '@angular/core';
import {IonicModule, ToastController} from '@ionic/angular';
import {NgForOf, NgClass, NgIf} from '@angular/common';
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import { Signal } from '@angular/core';

@Component({
  selector: 'app-estilos',
  templateUrl: './estilos.component.html',
  styleUrls: ['./estilos.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgClass, NgIf]
})
export class EstilosComponent {

  estilosExtra = ['Vintage', 'Boho', 'Elegante', 'Minimal', 'Sport'];

  @Input() usuario = signal<UsuarioDTO | null>(null);
  @Input() esMiPerfil = true;

  private usuarioService = inject(UsuarioService);
  private toastCtrl = inject(ToastController);

  asOpen = false;
  asHeader = 'Añadir estilo';
  asButtons: any[] = [];

  // Getter para que Angular lo recalcule en cada ciclo de change detection
  // trackea el signal del padre directamente desde el template
  get estilosSeleccionados(): string[] {
    const u = this.usuario();
    if (!u?.estilo) return [];
    return u.estilo.split(',').map(e => e.trim()).filter(e => e.length > 0);
  }

  agregarEstilo() {
    if (!this.esMiPerfil) return;

    this.asButtons = [
      ...this.estilosExtra.map(est => ({
        text: est,
        handler: () => {
          if (!this.estilosSeleccionados.includes(est)) {
            this.guardarEstilos([...this.estilosSeleccionados, est]);
          }
        }
      })),
      { text: 'Cancelar', role: 'cancel' }
    ];
    this.asOpen = true;
  }

  eliminarEstilo(est: string) {
    if (!this.esMiPerfil) return;
    this.guardarEstilos(this.estilosSeleccionados.filter(e => e !== est));
  }

  private guardarEstilos(estilos: string[]) {
    const u = this.usuario();
    if (!u?.id) return;

    const actualizado: UsuarioDTO = {
      ...u,
      estilo: estilos.length > 0 ? estilos.join(', ') : undefined
    };

    this.usuarioService.updateUsuario(u.id, actualizado).subscribe({
      next: async (usuarioGuardado) => {
        this.usuario.set(usuarioGuardado);
        await this.mostrarToast('Estilos guardados');
      },
      error: async () => await this.mostrarToast('Error al guardar estilos')
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
