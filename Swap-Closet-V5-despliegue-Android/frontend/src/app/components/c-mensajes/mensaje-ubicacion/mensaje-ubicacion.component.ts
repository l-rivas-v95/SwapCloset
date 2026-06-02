import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-mensaje-ubicacion',
    templateUrl: './mensaje-ubicacion.component.html',
    styleUrls: ['./mensaje-ubicacion.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class MensajeUbicacionComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
