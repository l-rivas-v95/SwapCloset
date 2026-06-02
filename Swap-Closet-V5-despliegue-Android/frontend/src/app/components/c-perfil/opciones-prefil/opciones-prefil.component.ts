import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import{RouterModule} from "@angular/router";
import {NgForOf} from "@angular/common";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {AuthService} from "../../../service/authService/auth.service";

@Component({
    selector: 'app-opciones-prefil',
    templateUrl: './opciones-prefil.component.html',
    styleUrls: ['./opciones-prefil.component.scss'],
    standalone: true,
    imports: [
        IonicModule, RouterModule, NgForOf
    ]
})
export class OpcionesPrefilComponent  implements OnInit {

  @Input() usuario = signal<UsuarioDTO | null>(null);

  private authService = inject(AuthService);
  constructor() { }



  ngOnInit() {}

  cerrarSesion() {

    this.authService.logout()
  }
}
