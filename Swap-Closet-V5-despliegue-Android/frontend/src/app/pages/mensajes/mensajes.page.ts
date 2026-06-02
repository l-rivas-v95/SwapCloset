import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {MensajesComponentComponent} from "../../components/c-mensajes/mensajes-component/mensajes-component.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
  standalone: true,
  imports: [IonicModule, MensajesComponentComponent, RouterLink]
})
export class MensajesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
