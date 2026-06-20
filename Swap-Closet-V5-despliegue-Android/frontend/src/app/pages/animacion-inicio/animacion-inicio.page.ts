import { Component, OnInit } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {IonicModule} from "@ionic/angular";
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-animacion-inicio',
  templateUrl: './animacion-inicio.page.html',
  styleUrls: ['./animacion-inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class AnimacionInicioPage implements OnInit {
  desaparecer = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // En navegador: saltar la animación directamente
    if (!Capacitor.isNativePlatform()) {
      this.router.navigateByUrl('/login');
      return;
    }

    // En Android/iOS: animación normal
    setTimeout(() => { this.desaparecer = true; }, 2500);
    setTimeout(() => { this.router.navigateByUrl('/login'); }, 3000);
  }
}
