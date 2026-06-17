import {Component, inject, OnInit, signal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {CartaUsuarioDTO} from "../../modelos/CartaUsuarioDTO";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-confirmacion-intercambio',
  templateUrl: './confirmacion-intercambio.page.html',
  styleUrls: ['./confirmacion-intercambio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ConfirmacionIntercambioPage implements OnInit {

  otroUsuario = signal<CartaUsuarioDTO | null>(null);
  otroUsuarioId!: number;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    this.otroUsuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.usuarioService.getCartaUsuarios(this.otroUsuarioId).subscribe(u => this.otroUsuario.set(u));
  }

  irAPerfil() {
    this.router.navigate(['/perfil', this.otroUsuarioId]);
  }

  volver() {
    this.router.navigate(['/chat']);
  }
}
