import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {IonicModule} from "@ionic/angular";
import {CabeceraPerfilComponent} from "../../shared/cabecera-perfil/cabecera-perfil.component";
import {EstilosComponent} from "../../shared/estilos/estilos.component";
import {ActivatedRoute} from "@angular/router";
import {TallasComponent} from "../../shared/tallas/tallas.component";
import {PublicacionesActivasPage} from "../publicaciones-activas/publicaciones-activas.page";
import {PublicacionesActivasComponent} from "../../shared/publicaciones-activas/publicaciones-activas.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-perfil-otro',
  templateUrl: './perfil-otro.page.html',
  styleUrls: ['./perfil-otro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    CabeceraPerfilComponent,
    EstilosComponent,
    TallasComponent,
    CabeceraPerfilComponent,
    EstilosComponent,
    TallasComponent,
    TallasComponent,
    PublicacionesActivasPage,
    PublicacionesActivasComponent,
    PublicacionesActivasComponent,
  ]
})
export class PerfilOtroPage implements OnInit {
  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);

  usuario = signal<UsuarioDTO | null>(null);

  constructor(private location: Location) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      console.error('No se proporcionó ID de usuario en la ruta');
      return;
    }

    this.cargarUsuario(id);
  }

  private cargarUsuario(id: number) {
    this.usuarioService.getUsuario(id).subscribe({
      next: (user) => {
        console.log('Respuesta getUsuario (raw):', user);
        console.log('Propiedades recibidas:', Object.keys(user || {}));
        // para ver valores exactos
        console.log('tCamiseta:', user?.tCamiseta, 'tPantalon:', user?.tPantalon, 'tCalzado:', user?.tCalzado);
        this.usuario.set(user);
      },
      error: (err) => console.error('Error al cargar usuario:', err)
    });
  }

  volver() {
    this.location.back();
  }
}
