import {Component, Input, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";

@Component({
    selector: 'app-opciones-perfil',
    templateUrl: './opciones-perfil.component.html',
    styleUrls: ['./opciones-perfil.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        RouterLink
    ]
})
export class OpcionesPrefilComponent  implements OnInit {

  @Input() usuario = signal<UsuarioDTO | null>(null);
  constructor() { }

  ngOnInit() {}

}

