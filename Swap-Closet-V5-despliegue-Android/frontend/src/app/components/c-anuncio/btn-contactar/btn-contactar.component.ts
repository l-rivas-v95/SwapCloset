import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-btn-contactar',
  templateUrl: './btn-contactar.component.html',
  styleUrls: ['./btn-contactar.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class BtnContactarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
