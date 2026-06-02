import {Component, effect, Input, OnInit, signal} from '@angular/core';
import {ActionSheetController, IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";

@Component({
    selector: 'app-estilos',
    templateUrl: './estilos.component.html',
    styleUrls: ['./estilos.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgForOf
    ]
})
export class EstilosComponent implements OnInit {

  @Input() usuario = signal<UsuarioDTO | null>(null);

  // Lista de estilos para mostrar en chips
  estilosSeleccionados: string[] = [];

  constructor() {
    // Se ejecuta cada vez que cambia usuario()
    effect(() => {
      const u = this.usuario();
      if (!u?.estilo) {
        this.estilosSeleccionados = [];
        return;
      }

      // Convertir "Bohemio, Urbano" → ["Bohemio", "Urbano"]
      this.estilosSeleccionados = u.estilo
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
    });
  }

  ngOnInit(): void {}
}
