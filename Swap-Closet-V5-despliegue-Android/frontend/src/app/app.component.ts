import {Component, computed, inject} from '@angular/core';
import {IonApp, IonFooter, IonRouterOutlet} from '@ionic/angular/standalone';
import {NgComponentOutlet} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, startWith} from 'rxjs/operators';
import {AuthService} from "./service/authService/auth.service";
import {MenuFooterComponent} from "./components/menu-footer/menu-footer.component";
import {DesktopSidebarComponent} from "./components/desktop-sidebar/desktop-sidebar.component";
import {OverlayService} from "./service/overlay/overlay.service";

const RUTAS_SIN_SHELL = ['/login', '/registro'];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, MenuFooterComponent, IonFooter, NgComponentOutlet, DesktopSidebarComponent],
  standalone: true
})
export class AppComponent {
  overlay = inject(OverlayService);
  private router = inject(Router);

  private url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  mostrarShell = computed(() =>
    !RUTAS_SIN_SHELL.some(r => this.url().startsWith(r))
  );

  constructor(private authService: AuthService) {
    this.authService.cargarUsuarioSesion();
  }
}
