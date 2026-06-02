import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-mensaje-fecha',
  templateUrl: './mensaje-fecha.component.html',
  styleUrls: ['./mensaje-fecha.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class MensajeFechaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
