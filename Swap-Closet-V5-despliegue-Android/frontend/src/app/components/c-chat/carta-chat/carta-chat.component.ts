import { Component, OnInit } from '@angular/core';
import {CartaChatProductoComponent} from "../carta-chat-producto/carta-chat-producto.component";
import{IonIcon, IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-carta-chat',
  templateUrl: './carta-chat.component.html',
  styleUrls: ['./carta-chat.component.scss'],
  standalone: true,
  imports: [
    CartaChatProductoComponent, CartaChatProductoComponent, IonicModule
  ]
})
export class CartaChatComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
