import { Component, inject, OnInit, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {NativeToastService} from "../../service/nativeToastService/native-toast.service";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location, NgIf } from '@angular/common';

import { ProductoDTO } from '../../modelos/ProductoDTO';
import { CartaUsuarioDTO } from '../../modelos/CartaUsuarioDTO';

import { ProductoService } from '../../service/productoService/producto.service';
import { UsuarioService } from '../../service/usuarioService/usuario.service';
import { AuthService } from '../../service/authService/auth.service';

import { BtnContactarComponent } from '../../components/c-anuncio/btn-contactar/btn-contactar.component';
import { ComponenteAnuncioComponent } from '../../components/c-anuncio/componente-anuncio/componente-anuncio.component';
import { FormularioAnuncioComponent } from '../../components/c-anuncio/formulario-anuncio/formulario-anuncio.component';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.page.html',
  styleUrls: ['./anuncio.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    NgIf,
    BtnContactarComponent,
    ComponenteAnuncioComponent,
    FormularioAnuncioComponent
  ]
})
export class AnuncioPage implements OnInit {

  idProducto!: string;

  // Declarative overlay state
  asOpen = false;
  asButtons: any[] = [];
  alertOpen = false;
  alertHeader = '';
  alertMessage = '';
  alertButtons: any[] = [];

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private toast = inject(NativeToastService);

  idUsuarioLogueado = this.authService.getUsuario()?.id ?? null;

  producto = signal<ProductoDTO | null>(null);
  usuario = signal<CartaUsuarioDTO | null>(null);
  estilos = signal<string[]>([]);
  modoEdicion = signal<boolean>(false);

  ngOnInit() {
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
    this.cargarProducto(this.idProducto);
  }

  private cargarProducto(id: string) {
    this.productoService.getProducto(Number(id)).subscribe({
      next: (prod) => {
        if (!prod) return;

        this.producto.set(prod);

        const listaEstilos = prod.estilo
          ? prod.estilo.split(',').map(e => e.trim())
          : [];
        this.estilos.set(listaEstilos);

        if (prod.idUsuario) {
          this.usuarioService
            .getCartaUsuarios(prod.idUsuario)
            .subscribe(u => this.usuario.set(u));
        }
      },
      error: (err) => console.error('Error al cargar anuncio:', err)
    });
  }

  getPrimeraImagen(): string {
    return this.producto()?.imagenes?.[0]?.urlImg
      || 'assets/icon/card-media.png';
  }

  volver() {
    if (!this.producto()?.id) return;
    this.cargarProducto(String(this.producto()?.id));
    this.location.back();
  }

  mostrarOpciones() {
    if (this.producto()?.idUsuario !== this.idUsuarioLogueado) return;

    this.asButtons = [
      { text: 'Editar', icon: 'create-outline', handler: () => this.modoEdicion.set(true) },
      { text: 'Desactivar', icon: 'archive-outline', handler: () => this.confirmarDesactivacion() },
      { text: 'Eliminar', role: 'destructive', icon: 'trash-outline', handler: () => this.confirmarEliminacion() },
      { text: 'Cancelar', role: 'cancel', icon: 'close' }
    ];
    this.asOpen = true;
  }

  confirmarDesactivacion() {
    this.alertHeader = 'Desactivar anuncio';
    this.alertMessage = 'El anuncio dejará de aparecer como activo, pero no se eliminará. ¿Quieres continuar?';
    this.alertButtons = [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Desactivar', handler: () => this.desactivarAnuncio() }
    ];
    this.alertOpen = true;
  }

  desactivarAnuncio() {
    const productoActual = this.producto();
    if (!productoActual?.id) return;

    const productoDesactivado: ProductoDTO = {
      ...productoActual,
      activo: false
    };

    this.productoService.updateProducto(productoActual.id, productoDesactivado).subscribe({
      next: (productoActualizado) => {
        this.producto.set(productoActualizado);
        this.toast.show('Anuncio desactivado');
        this.router.navigate(['/perfil']);
      },
      error: () => this.toast.show('Error al desactivar el anuncio')
    });
  }

  confirmarEliminacion() {
    this.alertHeader = 'Confirmar Eliminación';
    this.alertMessage = '¿Seguro que deseas eliminar este anuncio?';
    this.alertButtons = [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Eliminar', handler: () => this.eliminarAnuncio() }
    ];
    this.alertOpen = true;
  }

  eliminarAnuncio() {
    const id = this.producto()?.id;
    if (!id) return;

    this.productoService.eliminarProducto(id).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  onGuardar(productoActualizado: any) {
    this.producto.set(productoActualizado);
    this.modoEdicion.set(false);
    if (productoActualizado?.id) {
      this.cargarProducto(String(productoActualizado.id));
    }
  }

  onCancelar() {
    this.modoEdicion.set(false);
    if (!this.producto()?.id) return;
    this.cargarProducto(String(this.producto()?.id));
  }

}
