import {Component, inject, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {ChatService} from "../../../service/chatService/chat.service";
import {AuthService} from "../../../service/authService/auth.service";

@Component({
  selector: 'app-btn-contactar',
  templateUrl: './btn-contactar.component.html',
  styleUrls: ['./btn-contactar.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class BtnContactarComponent implements OnInit {

  @Input() productoId!: number;
  @Input() propietarioId!: number;

  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {}

  contactar() {
    const usuarioLogueado = this.authService.getUsuario();
    if (!usuarioLogueado?.id) return;

    this.chatService.findOrCreate(usuarioLogueado.id, this.propietarioId, this.productoId)
      .subscribe({
        next: (chat) => this.router.navigate(['/mensajes', chat.id]),
        error: (err) => console.error('Error al abrir chat:', err)
      });
  }
}
