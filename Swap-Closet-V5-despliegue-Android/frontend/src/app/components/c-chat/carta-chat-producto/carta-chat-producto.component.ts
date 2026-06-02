import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-carta-chat-producto',
  templateUrl: './carta-chat-producto.component.html',
  styleUrls: ['./carta-chat-producto.component.scss'],
  standalone: true,
    imports: [
        IonicModule
    ]
})
export class CartaChatProductoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
