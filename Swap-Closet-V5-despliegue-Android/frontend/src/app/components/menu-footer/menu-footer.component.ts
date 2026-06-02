import {Component, OnDestroy, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {NavigationEnd, Router, RouterModule} from "@angular/router";
import {AuthService} from "../../service/authService/auth.service";
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
  rutasSinFooter = ['/login', '/registro', '/animacion-inicio']; // Rutas donde no mostrar footer

  private routerSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(user => this.usuario = user);

    // Detectar cambios de ruta
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrar = !this.rutasSinFooter.includes(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }
}

