import {Component, effect, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {UsuarioDTO} from "../../../modelos/UsuarioDTO";
import {ProductoService} from "../../../service/productoService/producto.service";
import {ProductoDTO} from "../../../modelos/ProductoDTO";
import {
  CartaPublicacionesActivasIntercambioComponent
} from "../publicaciones-activas/carta-publicaciones-activas-intercambio/carta-publicaciones-activas-intercambio.component";

@Component({
  selector: 'app-publicaciones-pasadas',
  templateUrl: './publicaciones-pasadas.component.html',
  styleUrls: ['./publicaciones-pasadas.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    CartaPublicacionesActivasIntercambioComponent
  ]
})
export class PublicacionesPasadasComponent implements OnInit {

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
      next: (productos) => this.productos.set(productos.filter(p => p.activo === false)),
      error: (err) => {
        console.error('Error al cargar publicaciones pasadas del perfil:', err);
        this.productos.set([]);
      }
    });
  }
}
