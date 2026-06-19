import {Component, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {IonicModule, IonContent} from "@ionic/angular";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DateModalComponentComponent} from "../../components/date-modal-component/date-modal-component.component";
import {LocalModalComponentComponent} from "../../components/local-modal-component/local-modal-component.component";
import {ProductoPickerModalComponent} from "../../components/producto-picker-modal/producto-picker-modal.component";
import {FormsModule} from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {interval, Subscription} from "rxjs";

import {ChatService} from "../../service/chatService/chat.service";
import {MensajeService} from "../../service/mensajeService/mensaje.service";
import {AuthService} from "../../service/authService/auth.service";
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {ProductoService} from "../../service/productoService/producto.service";
import {NotificacionService} from "../../service/notificacionService/notificacion.service";
import {OverlayService} from "../../service/overlay/overlay.service";

import {ChatDTO} from "../../modelos/ChatDTO";
import {MensajeDTO} from "../../modelos/MensajeDTO";
import {CartaUsuarioDTO} from "../../modelos/CartaUsuarioDTO";
import {ProductoDTO} from "../../modelos/ProductoDTO";

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, FormsModule, CommonModule, DatePipe]
})
export class MensajesPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content!: IonContent;

  chat = signal<ChatDTO | null>(null);
  mensajes = signal<MensajeDTO[]>([]);
  otroUsuario = signal<CartaUsuarioDTO | null>(null);
  producto = signal<ProductoDTO | null>(null);

  nuevoMensaje = '';
  miUsuarioId!: number;
  miNombre = '';
  productosImgCache = new Map<number, string>();
  private pollSub?: Subscription;
  private chatId!: number;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private mensajeService = inject(MensajeService);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private productoService = inject(ProductoService);
  private sanitizer = inject(DomSanitizer);
  private notificaciones = inject(NotificacionService);
  private overlayService = inject(OverlayService);

  ngOnInit() {

    const usuario = this.authService.getUsuario();
    if (!usuario?.id) return;
    this.miUsuarioId = usuario.id;
    this.miNombre = usuario.nombre ?? 'El otro usuario';

    this.chatId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarChat(this.chatId);

    this.pollSub = interval(5000).subscribe(() => {
      this.mensajeService.getMensajesByChat(this.chatId).subscribe(msgs => {
        this.mensajes.set(msgs);
      });
      this.chatService.getChat(this.chatId).subscribe(c => this.chat.set(c));
      this.mensajeService.marcarLeidos(this.chatId, this.miUsuarioId).subscribe();
    });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  cargarChat(chatId: number) {
    this.mensajeService.marcarLeidos(chatId, this.miUsuarioId).subscribe({
      next: () => this.notificaciones.refrescar()
    });

    this.chatService.getChat(chatId).subscribe({
      next: (chat) => {
        this.chat.set(chat);
        const otroId = chat.usuario1Id === this.miUsuarioId ? chat.usuario2Id! : chat.usuario1Id!;
        this.usuarioService.getCartaUsuarios(otroId).subscribe(u => this.otroUsuario.set(u));
        if (chat.producto1Id) {
          this.productoService.getProducto(chat.producto1Id).subscribe(p => this.producto.set(p));
        }
        this.cargarMensajes(chatId);
      },
      error: (err) => console.error('Error cargando chat:', err)
    });
  }

  cargarMensajes(chatId: number) {
    this.mensajeService.getMensajesByChat(chatId).subscribe({
      next: (msgs) => {
        this.mensajes.set(msgs);
        msgs.filter(m => m.tipo === 'PRODUCTO' && m.contenido).forEach(m => {
          const id = Number(m.contenido);
          if (!this.productosImgCache.has(id)) {
            this.productoService.getProducto(id).subscribe(p => {
              const url = p.imagenes?.[0]?.urlImg || '';
              this.productosImgCache.set(id, url);
            });
          }
        });
        setTimeout(() => this.content?.scrollToBottom(300), 100);
      },
      error: (err) => console.error('Error cargando mensajes:', err)
    });
  }

  getProductoImg(contenido: string): string {
    return this.productosImgCache.get(Number(contenido)) || 'assets/icon/card-media.png';
  }

  enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    if (!texto || !this.chat()?.id) return;
    const msg: MensajeDTO = {
      idChat: this.chat()!.id,
      contenido: texto,
      idRemitente: this.miUsuarioId,
      tipo: 'TEXTO'
    };
    this.mensajeService.enviar(msg).subscribe({
      next: () => { this.nuevoMensaje = ''; this.cargarMensajes(this.chat()!.id!); }
    });
  }

  proponerFecha() {
    this.overlayService.open(DateModalComponentComponent, {}, (data) => {
      if (data) this.enviarPropuesta('FECHA', data);
    });
  }

  proponerLugar() {
    this.overlayService.open(LocalModalComponentComponent, {}, (data) => {
      if (data) this.enviarPropuesta('UBICACION', data);
    });
  }

  proponerEntrega() {
    this.overlayService.open(DateModalComponentComponent, {}, (data) => {
      if (data) this.enviarPropuesta('FECHA_DEVOLUCION', data);
    });
  }

  proponerPrenda() {
    const otroId = this.chat()?.usuario1Id;
    if (!otroId) return;
    this.overlayService.open(ProductoPickerModalComponent, { usuarioId: otroId }, (data) => {
      if (data?.id) this.enviarPropuesta('PRODUCTO', String(data.id));
    });
  }

  esPropietario(): boolean {
    return this.miUsuarioId === this.chat()?.usuario2Id;
  }

  esIntercambio(): boolean {
    return this.producto()?.tipo?.toLowerCase().includes('intercambio') ?? false;
  }

  private enviarPropuesta(tipo: MensajeDTO['tipo'], contenido: string) {
    const msg: MensajeDTO = {
      idChat: this.chat()!.id,
      contenido,
      idRemitente: this.miUsuarioId,
      tipo
    };
    this.mensajeService.enviar(msg).subscribe({
      next: () => this.cargarMensajes(this.chat()!.id!)
    });
  }

  aceptarPropuesta(mensajeId: number) {
    this.mensajeService.responderPropuesta(mensajeId, true).subscribe({
      next: () => this.cargarChat(this.chat()!.id!)
    });
  }

  rechazarPropuesta(mensajeId: number) {
    this.mensajeService.responderPropuesta(mensajeId, false).subscribe({
      next: () => this.cargarMensajes(this.chat()!.id!)
    });
  }

  confirmar() {
    const chatId = this.chat()?.id;
    if (!chatId || !this.puedeConfirmar()) return;

    const aviso: MensajeDTO = {
      idChat: chatId,
      contenido: `✅ ${this.miNombre} ha confirmado el intercambio. ¡Confírmalo tú también para completarlo!`,
      idRemitente: this.miUsuarioId,
      tipo: 'TEXTO'
    };
    this.mensajeService.enviar(aviso).subscribe();

    this.chatService.confirmar(chatId, this.miUsuarioId).subscribe({
      next: (chatActualizado) => {
        this.chat.set(chatActualizado);
        if (chatActualizado.completado) {
          const otroId = chatActualizado.usuario1Id === this.miUsuarioId
            ? chatActualizado.usuario2Id
            : chatActualizado.usuario1Id;
          this.router.navigate(['/confirmacion-intercambio', otroId]);
        } else {
          this.cargarMensajes(chatId);
        }
      }
    });
  }

  yoConfirme(): boolean {
    const chat = this.chat();
    if (!chat) return false;
    return chat.usuario1Id === this.miUsuarioId ? !!chat.confirmado1 : !!chat.confirmado2;
  }

  esMio(msg: MensajeDTO): boolean {
    return msg.idRemitente === this.miUsuarioId;
  }

  puedeEditar(msg: MensajeDTO): boolean {
    return this.esMio(msg) && msg.aceptado == null &&
      (msg.tipo === 'FECHA' || msg.tipo === 'FECHA_DEVOLUCION' || msg.tipo === 'UBICACION' || msg.tipo === 'PRODUCTO');
  }

  editar(msg: MensajeDTO) {
    if (!msg.id) return;
    const editId = msg.id;
    const editMsg = { ...msg };

    const guardar = (nuevoContenido: string) => {
      const actualizado: MensajeDTO = { ...editMsg, contenido: nuevoContenido };
      this.mensajeService.actualizar(editId, actualizado).subscribe({
        next: () => this.cargarMensajes(this.chat()!.id!)
      });
    };

    switch (msg.tipo) {
      case 'FECHA':
      case 'FECHA_DEVOLUCION':
        this.overlayService.open(DateModalComponentComponent, {}, (data) => { if (data) guardar(data); });
        break;
      case 'UBICACION':
        this.overlayService.open(LocalModalComponentComponent, {}, (data) => { if (data) guardar(data); });
        break;
      case 'PRODUCTO': {
        const otroId = this.chat()?.usuario1Id;
        if (!otroId) return;
        this.overlayService.open(ProductoPickerModalComponent, { usuarioId: otroId }, (data) => {
          if (data?.id) guardar(String(data.id));
        });
        break;
      }
    }
  }

  puedeResponderPropuesta(): boolean {
    const msgs = this.mensajes();
    return msgs.some(m => m.tipo === 'FECHA') && msgs.some(m => m.tipo === 'UBICACION');
  }

  puedeConfirmar(): boolean {
    const msgs = this.mensajes();
    const fechaOk   = msgs.some(m => m.tipo === 'FECHA' && m.aceptado === true);
    const lugarOk   = msgs.some(m => m.tipo === 'UBICACION' && m.aceptado === true);
    const entregaOk = msgs.some(m => m.tipo === 'FECHA_DEVOLUCION' && m.aceptado === true);
    const prendaOk  = !this.esIntercambio() || msgs.some(m => m.tipo === 'PRODUCTO' && m.aceptado === true);
    return fechaOk && lugarOk && entregaOk && prendaOk;
  }

  motivoNoConfirmar(): string {
    const msgs = this.mensajes();
    const falta: string[] = [];
    if (!msgs.some(m => m.tipo === 'FECHA' && m.aceptado === true)) falta.push('fecha de quedada');
    if (!msgs.some(m => m.tipo === 'UBICACION' && m.aceptado === true)) falta.push('lugar');
    if (!msgs.some(m => m.tipo === 'FECHA_DEVOLUCION' && m.aceptado === true)) falta.push('fecha de entrega');
    if (this.esIntercambio() && !msgs.some(m => m.tipo === 'PRODUCTO' && m.aceptado === true)) falta.push('prenda a intercambiar');
    if (falta.length === 0) return '';
    return `Falta acordar: ${falta.join(', ')}`;
  }

  formatearFecha(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  formatearHora(iso: string | undefined): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  getMapUrl(lugar: string): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(lugar)}&output=embed&z=15`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  volver() {
    this.router.navigate(['/chat']);
  }
}
