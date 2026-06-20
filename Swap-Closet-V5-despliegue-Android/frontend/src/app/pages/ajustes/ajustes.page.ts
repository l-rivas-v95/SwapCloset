import {Component, inject, OnInit, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AuthService} from '../../service/authService/auth.service';
import {UsuarioService} from '../../service/usuarioService/usuario.service';
import {UsuarioDTO} from '../../modelos/UsuarioDTO';
import {OpcionesPrefilComponent} from '../../components/c-perfil/opciones-prefil/opciones-prefil.component';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  imports: [IonicModule, OpcionesPrefilComponent]
})
export class AjustesPage implements OnInit {

  usuario = signal<UsuarioDTO | null>(null);

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    const u = this.authService.getUsuario();
    if (u?.id) {
      this.usuarioService.getUsuario(u.id).subscribe({
        next: (usr) => this.usuario.set(usr)
      });
    }
  }
}
