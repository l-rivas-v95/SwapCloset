import {Component, effect, inject, Input, OnInit, signal} from '@angular/core';
import {IonicModule, ActionSheetController, ToastController} from '@ionic/angular';
import {NgForOf, NgClass} from '@angular/common';
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";

@Component({
  selector: 'app-estilos',
  templateUrl: './estilos.component.html',
  styleUrls: ['./estilos.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgClass]
})
export class EstilosComponent implements OnInit {

  estilosSeleccionados: string[] = [];
  estilosExtra = ['Vintage', 'Boho', 'Elegante', 'Minimal', 'Sport'];

  @Input() usuario = signal<UsuarioDTO | null>(null);
  @Input() esMiPerfil = true;

  private usuarioService = inject(UsuarioService);
  private toastCtrl = inject(ToastController);

  constructor(private actionSheetCtrl: ActionSheetController) {
    effect(() => {
      const u = this.usuario();
      if (!u?.estilo) {
        this.estilosSeleccionados = [];
        return;
      }

      this.estilosSeleccionados = u.estilo
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
    });
  }

  ngOnInit(): void {}

  async agregarEstilo() {
    if (!this.esMiPerfil) return;

    const botones = this.estilosExtra.map(est => ({
      text: est,
      handler: () => {
        if (!this.estilosSeleccionados.includes(est)) {
          this.guardarEstilos([...this.estilosSeleccionados, est]);
        }
      }
    }));

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Añadir estilo',
      buttons: [...botones, {text: 'Cancelar', role: 'cancel'}] as any[]
    });

    await actionSheet.present();
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
