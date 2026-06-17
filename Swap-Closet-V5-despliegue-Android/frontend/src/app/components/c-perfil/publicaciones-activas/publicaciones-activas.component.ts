import {Component, effect, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {CartaPublicacionesActivasIntercambioComponent} from "./carta-publicaciones-activas-intercambio/carta-publicaciones-activas-intercambio.component";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {ProductoService} from "../../../service/productoService/producto.service";
import {ProductoDTO} from "../../../modelos/ProductoDTO";

@Component({
  selector: 'app-publicaciones-activas',
  templateUrl: './publicaciones-activas.component.html',
  styleUrls: ['./publicaciones-activas.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    CartaPublicacionesActivasIntercambioComponent
  ]
})
export class PublicacionesActivasComponent implements OnInit {

  @Input() usuario!: WritableSignal<UsuarioDTO | null>;
  productos = signal<ProductoDTO[]>([]);

  private productoService = inject(ProductoService);
  private ultimoIdCargado?: number;

  private cargarProductosEffect = effect(() => {
    const idUsuarioPerfil = this.usuario()?.id;

    if (!idUsuarioPerfil) {
      this.productos.set([]);
      this.ultimoIdCargado = undefined;
      return;
    }

    if (this.ultimoIdCargado === idUsuarioPerfil) return;

    this.ultimoIdCargado = idUsuarioPerfil;
    this.cargarProductos(idUsuarioPerfil);
  });

  ngOnInit(): void {}

  private cargarProductos(idUsuarioPerfil: number) {
    this.productoService.getProductosByUsuario(idUsuarioPerfil).subscribe({
      next: (productos) => {
        const activos = productos
          .filter(p => p.activo === true)
          .sort((a, b) => {
            const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
            const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
            return dateB - dateA;
          });
        this.productos.set(activos);
      },
      error: (err) => {
        console.error('Error al cargar publicaciones activas del perfil:', err);
        this.productos.set([]);
      }
    });
  }
}
