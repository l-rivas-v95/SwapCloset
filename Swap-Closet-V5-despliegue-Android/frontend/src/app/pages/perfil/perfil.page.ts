import {Component, inject, OnInit, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {NgIf} from "@angular/common";
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {CabeceraPerfilComponent} from "../../components/c-perfil/cabecera-perfil/cabecera-perfil.component";
import {EstilosComponent} from "../../components/c-perfil/estilos/estilos.component";
import {TallasComponent} from "../../components/c-perfil/tallas/tallas.component";
import {PublicacionesActivasComponent} from "../../components/c-perfil/publicaciones-activas/publicaciones-activas.component";
import {OpcionesPrefilComponent} from "../../components/c-perfil/opciones-prefil/opciones-prefil.component";
import {AuthService} from "../../service/authService/auth.service";
import {UsuarioEstadisticasDTO} from "../../modelos/UsuarioEstadisticasDTO";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    NgIf,
    CabeceraPerfilComponent,
    EstilosComponent,
    TallasComponent,
    PublicacionesActivasComponent,
    OpcionesPrefilComponent
  ]
})
export class PerfilPage implements OnInit {

  usuario = signal<UsuarioDTO | null>(null);
  usuarioEstadisticas = signal<UsuarioEstadisticasDTO | null>(null);
  esMiPerfil = signal<boolean>(true);

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const idRuta = Number(this.route.snapshot.paramMap.get('id'));
    const usuarioSesion = this.authService.getUsuario();
    const idUsuario = idRuta || usuarioSesion?.id;

    if (!idUsuario) {
      console.warn('No hay usuario para cargar el perfil');
      return;
    }

    this.esMiPerfil.set(!idRuta || idRuta === usuarioSesion?.id);
    this.cargarUsuario(idUsuario);
    this.cargarEstadisticas(idUsuario);
  }

  private cargarUsuario(idUsuario: number) {
    this.usuarioService.getUsuario(idUsuario).subscribe({
      next: (usuario) => this.usuario.set(usuario),
      error: (err) => console.error('Error al cargar usuario:', err)
    });
  }

  private cargarEstadisticas(idUsuario: number) {
    this.usuarioService.getUsuarioEstadisticas(idUsuario).subscribe({
      next: (estadisticas) => this.usuarioEstadisticas.set(estadisticas),
      error: (err) => console.error('Error al cargar estadísticas del usuario:', err)
    });
  }
}
