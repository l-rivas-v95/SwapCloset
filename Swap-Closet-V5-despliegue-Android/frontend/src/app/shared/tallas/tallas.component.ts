import {Component, effect, Input, OnInit, signal} from '@angular/core';
import { IonicModule} from "@ionic/angular";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";

@Component({
    selector: 'app-tallas',
    templateUrl: './tallas.component.html',
    styleUrls: ['./tallas.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class TallasComponent implements OnInit {

  @Input() usuario = signal<UsuarioDTO | null>(null);

  ngOnInit(){
    console.log(this.usuario());
  }
}
