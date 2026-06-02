import { Component, OnInit } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {IonicModule} from "@ionic/angular";

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
    // Después de 2.5s comienza fade out
    setTimeout(() => {
      this.desaparecer = true;
    }, 2500);

    // Después de 3s navega a home
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }
}
