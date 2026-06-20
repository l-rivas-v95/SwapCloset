import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/authService/auth.service';
import { NotificacionService } from '../../service/notificacionService/notificacion.service';
import { ExplorarFiltrosService } from '../../service/explorarFiltros/explorar-filtros.service';
import { HomeFiltrosService } from '../../service/homeFiltros/home-filtros.service';
import { UsuarioDTO } from '../../modelos/UsuarioDTO';

@Component({
  selector: 'app-desktop-sidebar',
  templateUrl: './desktop-sidebar.component.html',
  styleUrls: ['./desktop-sidebar.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, NgIf],
})
export class DesktopSidebarComponent implements OnInit, OnDestroy {
  usuario: UsuarioDTO | null = null;
  mostrar = true;
  noLeidos = 0;
  enExplorar = false;
  enHome     = false;

  private rutasSinSidebar = ['/login', '/registro', '/animacion-inicio'];
  private subs: Subscription[] = [];

  private authService    = inject(AuthService);
  private router         = inject(Router);
  private notificaciones = inject(NotificacionService);
  filtros                = inject(ExplorarFiltrosService);
  homeFiltros            = inject(HomeFiltrosService);

  ngOnInit() {
    this.subs.push(
      this.authService.usuarioActual$.subscribe(u => (this.usuario = u)),
      this.notificaciones.noLeidos$.subscribe(n => (this.noLeidos = n)),
      this.router.events.subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          this.mostrar    = !this.rutasSinSidebar.some(r => ev.urlAfterRedirects.startsWith(r));
          this.enExplorar = ev.urlAfterRedirects.startsWith('/explorar');
          this.enHome     = ev.urlAfterRedirects === '/home' || ev.urlAfterRedirects.startsWith('/home?');
        }
      })
    );
    // Detectar ruta inicial
    this.enExplorar = this.router.url.startsWith('/explorar');
    this.enHome     = this.router.url === '/home' || this.router.url.startsWith('/home?');
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
