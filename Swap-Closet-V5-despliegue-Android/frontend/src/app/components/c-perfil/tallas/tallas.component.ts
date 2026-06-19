import {Component, EventEmitter, inject, Input, Output, Signal, Type} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {NativeToastService} from "../../../service/nativeToastService/native-toast.service";
import {NgIf} from '@angular/common';
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {OverlayService} from "../../../service/overlay/overlay.service";
import {TallaCamisetaPickerModalComponent} from "../../talla-camiseta-picker-modal/talla-camiseta-picker-modal.component";
import {TallaPantalonPickerModalComponent} from "../../talla-pantalon-picker-modal/talla-pantalon-picker-modal.component";
import {TallaCalzadoPickerModalComponent} from "../../talla-calzado-picker-modal/talla-calzado-picker-modal.component";

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
  private toast = inject(NativeToastService);
  private overlayService = inject(OverlayService);

  elegirTalla(tipo: 'tCamiseta' | 'tPantalon' | 'tCalzado') {
    if (!this.esMiPerfil) return;

    const componente =
      tipo === 'tCamiseta' ? TallaCamisetaPickerModalComponent :
      tipo === 'tPantalon' ? TallaPantalonPickerModalComponent :
                              TallaCalzadoPickerModalComponent;

    this.overlayService.open(componente as Type<any>, {}, (talla: string | null) => {
      if (!talla) return;
      this.guardarTalla(tipo, talla);
    });
  }

  private guardarTalla(tipo: 'tCamiseta' | 'tPantalon' | 'tCalzado', talla: string) {
    const u = this.usuario();
    if (!u?.id) return;

    const valor = tipo === 'tCamiseta' ? talla : Number(talla);
    const actualizado = {...u, [tipo]: valor};

    this.usuarioService.updateUsuario(u.id, actualizado).subscribe({
      next: (usuarioGuardado) => {
        this.usuarioChange.emit(usuarioGuardado);
        this.toast.show('Talla guardada');
      },
      error: () => this.toast.show('Error al guardar talla')
    });
  }
}
