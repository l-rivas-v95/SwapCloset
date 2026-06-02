import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import {CartaChatComponent} from "../../components/c-chat/carta-chat/carta-chat.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CartaChatComponent]
})
export class ChatPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
