import {Component, inject} from '@angular/core';
import {IonApp, IonFooter, IonRouterOutlet} from '@ionic/angular/standalone';
import {NgComponentOutlet} from '@angular/common';
import {AuthService} from "./service/authService/auth.service";
import {MenuFooterComponent} from "./components/menu-footer/menu-footer.component";
import {OverlayService} from "./service/overlay/overlay.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, MenuFooterComponent, IonFooter, NgComponentOutlet],
  standalone: true
})
export class AppComponent {
  overlay = inject(OverlayService);

  constructor(private authService: AuthService) {
    this.authService.cargarUsuarioSesion();
  }
}
