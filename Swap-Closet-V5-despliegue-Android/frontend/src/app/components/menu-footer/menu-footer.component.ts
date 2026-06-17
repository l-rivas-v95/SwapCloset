import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {NavigationEnd, Router, RouterModule} from "@angular/router";
import {AuthService} from "../../service/authService/auth.service";
import {NotificacionService} from "../../service/notificacionService/notificacion.service";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-menu-footer',
  templateUrl: './menu-footer.component.html',
  styleUrls: ['./menu-footer.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, NgIf]
})
export class MenuFooterComponent implements OnInit, OnDestroy {
  usuario: UsuarioDTO | null = null;
  mostrar: boolean = true;
  rutasSinFooter = ['/login', '/registro', '/animacion-inicio'];

  noLeidos = 0;

  private routerSub!: Subscription;
  private noLeidosSub?: Subscription;
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificaciones = inject(NotificacionService);

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(user => this.usuario = user);

    this.noLeidosSub = this.notificaciones.noLeidos$.subscribe(n => this.noLeidos = n);

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrar = !this.rutasSinFooter.includes(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    this.noLeidosSub?.unsubscribe();
  }
}

