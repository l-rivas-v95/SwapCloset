import {Component, inject, input, OnInit, signal} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

// Componentes compartidos standalone
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {NgIf} from "@angular/common";
import {CabeceraPerfilComponent} from "../../components/c-perfil/cabecera-perfil/cabecera-perfil.component";
import {EstilosComponent} from "../../components/c-perfil/estilos/estilos.component";
import {TallasComponent} from "../../components/c-perfil/tallas/tallas.component";
import {
  PublicacionesActivasComponent
} from "../../components/c-perfil/publicaciones-activas/publicaciones-activas.component";
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
  idUsuario: number | undefined;

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(usuario => {
      if (usuario) {
        console.log('Usuario cargado:', usuario);
        this.usuario.set(usuario);
      } else {
        console.warn('No hay usuario logueado');
        // Opcional: redirigir al login
      }

      this.idUsuario = this.authService.getUsuario()?.id
      this.usuarioService.getUsuarioEstadisticas(this.idUsuario!).subscribe({
        next: (estadisticas) => {
          this.usuarioEstadisticas.set(estadisticas);
          console.log('Estadísticas cargadas:', estadisticas);
        },
        error: (err) => {
          console.error('Error al cargar estadísticas del usuario:', err);
      }
    });
    }
    );
  }
}

