import {Component, inject, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ChatDTO} from "../../../modelos/ChatDTO";
import {CartaUsuarioDTO} from "../../../modelos/CartaUsuarioDTO";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {MensajeDTO} from "../../../modelos/MensajeDTO";
import {UsuarioService} from "../../../service/usuarioService/usuario.service";
import {ProductoService} from "../../../service/productoService/producto.service";
import {MensajeService} from "../../../service/mensajeService/mensaje.service";

@Component({
  selector: 'app-carta-chat',
  templateUrl: './carta-chat.component.html',
  styleUrls: ['./carta-chat.component.scss'],
  standalone: true,
  imports: []
})
export class CartaChatComponent implements OnInit {

  @Input() chat!: ChatDTO;
  @Input() miUsuarioId!: number;
  @Input() busqueda: string = '';

  otroUsuario: CartaUsuarioDTO | null = null;
  producto: ProductoDTO | null = null;
  ultimoMensaje: MensajeDTO | null = null;

  get esVisible(): boolean {
    const term = this.busqueda.toLowerCase().trim();
    if (!term) return true;
    const nombre = `${this.otroUsuario?.nombre ?? ''} ${this.otroUsuario?.apellidos ?? ''}`.toLowerCase();
    const titulo = (this.producto?.titulo ?? '').toLowerCase();
    return nombre.includes(term) || titulo.includes(term);
  }

  private usuarioService = inject(UsuarioService);
  private productoService = inject(ProductoService);
  private mensajeService = inject(MensajeService);
  private router = inject(Router);

  ngOnInit() {
    const otroId = this.chat.usuario1Id === this.miUsuarioId
      ? this.chat.usuario2Id!
      : this.chat.usuario1Id!;

    this.usuarioService.getCartaUsuarios(otroId).subscribe(u => this.otroUsuario = u);

    if (this.chat.producto1Id) {
      this.productoService.getProducto(this.chat.producto1Id).subscribe(p => this.producto = p);
    }

    if (this.chat.id) {
      this.mensajeService.getMensajesByChat(this.chat.id).subscribe(msgs => {
        this.ultimoMensaje = msgs.length ? msgs[msgs.length - 1] : null;
      });
    }
  }

  formatearHora(fecha: string | Date | null | undefined): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const ahora = new Date();
    const mismodia = d.toDateString() === ahora.toDateString();
    if (mismodia) {
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    const diffDias = Math.floor((ahora.getTime() - d.getTime()) / 86400000);
    if (diffDias < 7) {
      return d.toLocaleDateString('es-ES', { weekday: 'short' });
    }
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }

  abrirChat() {
    this.router.navigate(['/mensajes', this.chat.id]);
  }
}
