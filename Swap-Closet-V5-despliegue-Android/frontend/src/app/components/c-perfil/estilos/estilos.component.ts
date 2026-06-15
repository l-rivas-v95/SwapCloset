import {Component, effect, Input, OnInit, signal} from '@angular/core';
import {IonicModule, ActionSheetController} from '@ionic/angular';
import {NgForOf, NgClass} from '@angular/common';
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";

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
          this.estilosSeleccionados.push(est);
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
    this.estilosSeleccionados = this.estilosSeleccionados.filter(e => e !== est);
  }
}
