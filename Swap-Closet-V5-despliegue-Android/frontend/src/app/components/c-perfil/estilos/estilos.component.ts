import {Component, inject, Input, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {NgForOf, NgClass, NgIf} from '@angular/common';
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {Signal} from '@angular/core';
import {OverlayService} from "../../../service/overlay/overlay.service";
import {EstiloPickerModalComponent} from "../../estilo-picker-modal/estilo-picker-modal.component";

@Component({
  selector: 'app-estilos',
  templateUrl: './estilos.component.html',
  styleUrls: ['./estilos.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgClass, NgIf]
})
export class EstilosComponent {

  @Input() usuario = signal<UsuarioDTO | null>(null);
  @Input() esMiPerfil = true;

  private usuarioService = inject(UsuarioService);
  private toast = inject(NativeToastService);
  private overlayService = inject(OverlayService);

  get estilosSeleccionados(): string[] {
    const u = this.usuario();
    if (!u?.estilo) return [];
    return u.estilo.split(',').map(e => e.trim()).filter(e => e.length > 0);
  }

  agregarEstilo() {
    if (!this.esMiPerfil) return;
    this.overlayService.open(EstiloPickerModalComponent, {}, (seleccionado: string | null) => {
      if (!seleccionado) return;
      if (!this.estilosSeleccionados.includes(seleccionado)) {
        this.guardarEstilos([...this.estilosSeleccionados, seleccionado]);
      }
    });
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
      next: (usuarioGuardado) => {
        this.usuario.set(usuarioGuardado);
        this.toast.show('Estilos guardados');
      },
      error: () => this.toast.show('Error al guardar estilos')
    });
  }
}
