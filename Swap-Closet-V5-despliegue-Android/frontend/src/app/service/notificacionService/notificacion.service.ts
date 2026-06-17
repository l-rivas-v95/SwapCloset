import {inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, Subscription, timer} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {merge} from 'rxjs';
import {ChatService} from '../chatService/chat.service';
import {AuthService} from '../authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService implements OnDestroy {

  private noLeidosSubject = new BehaviorSubject<number>(0);
  noLeidos$ = this.noLeidosSubject.asObservable();

  private refrescarSubject = new Subject<void>();
  private pollSub?: Subscription;
  private usuarioSub?: Subscription;
  private uid?: number;

  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  constructor() {
    this.usuarioSub = this.authService.usuarioActual$.subscribe(usuario => {
      this.pollSub?.unsubscribe();
      if (!usuario?.id) {
        this.noLeidosSubject.next(0);
        this.uid = undefined;
        return;
      }
      this.uid = usuario.id;
      // Combina el timer periódico con el Subject de refresco manual
      this.pollSub = merge(timer(0, 30000), this.refrescarSubject).pipe(
        switchMap(() => this.chatService.getChatsByUsuario(this.uid!))
      ).subscribe({
        next: (chats) => {
          const total = chats.reduce((acc, c) => acc + (c.mensajesNoLeidos ?? 0), 0);
          this.noLeidosSubject.next(total);
        },
        error: () => {}
      });
    });
  }

  /** Fuerza una actualización inmediata del contador */
  refrescar() {
    this.refrescarSubject.next();
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
    this.usuarioSub?.unsubscribe();
  }
}
