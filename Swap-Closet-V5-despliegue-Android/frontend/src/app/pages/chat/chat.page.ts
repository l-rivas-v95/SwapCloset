import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CartaChatComponent} from "../../components/c-chat/carta-chat/carta-chat.component";
import {ChatService} from "../../service/chatService/chat.service";
import {AuthService} from "../../service/authService/auth.service";
import {ChatDTO} from "../../modelos/ChatDTO";
import {interval, Subscription} from "rxjs";
import {MensajesPage} from "../mensajes/mensajes.page";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CartaChatComponent, MensajesPage]
})
export class ChatPage implements OnInit, OnDestroy {

  chats = signal<ChatDTO[]>([]);
  busqueda = signal<string>('');
  segmento = signal<string>('todos');
  chatSeleccionadoId = signal<number | null>(null);
  miUsuarioId!: number;

  chatsFiltrados = computed(() => {
    const seg = this.segmento();
    return this.chats().filter(c => {
      if (seg === 'Activos'     && c.completado)  return false;
      if (seg === 'Completados' && !c.completado) return false;
      return true;
    });
  });

  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private pollSub?: Subscription;

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    if (!usuario?.id) return;
    this.miUsuarioId = usuario.id;
    this.cargarChats();
    this.pollSub = interval(30000).subscribe(() => this.cargarChats());
  }

  ionViewWillEnter() {
    if (this.miUsuarioId) this.cargarChats();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  private cargarChats() {
    this.chatService.getChatsByUsuario(this.miUsuarioId).subscribe({
      next: (chats) => this.chats.set(chats),
      error: (err) => console.error('Error cargando chats:', err)
    });
  }
}
