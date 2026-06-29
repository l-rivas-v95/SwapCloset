import {Component, inject, OnInit, signal, Type} from '@angular/core';
import {IonicModule, ViewWillEnter} from '@ionic/angular';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {NgIf} from "@angular/common";
import {UsuarioService} from "../../service/usuarioService/usuario.service";
import {UsuarioDTO} from "../../modelos/UsuarioDTO";
import {ProductoDTO} from "../../modelos/ProductoDTO";
import {CabeceraPerfilComponent} from "../../components/c-perfil/cabecera-perfil/cabecera-perfil.component";
import {EstilosComponent} from "../../components/c-perfil/estilos/estilos.component";
import {TallasComponent} from "../../components/c-perfil/tallas/tallas.component";
import {PublicacionesActivasComponent} from "../../components/c-perfil/publicaciones-activas/publicaciones-activas.component";
import {PublicacionesPasadasComponent} from "../../components/c-perfil/publicaciones-pasadas/publicaciones-pasadas.component";
import {OpcionesPrefilComponent} from "../../components/c-perfil/opciones-prefil/opciones-prefil.component";
import {CartaHorizontalIntercambioComponent} from "../../components/c-explorar/carta-horizontal-intercambio/carta-horizontal-intercambio.component";
import {TarjetaSeguidorComponent} from "../../components/c-seguidores/tarjeta-seguidor/tarjeta-seguidor.component";
import {AuthService} from "../../service/authService/auth.service";
import {UsuarioEstadisticasDTO} from "../../modelos/UsuarioEstadisticasDTO";
import {OverlayService} from "../../service/overlay/overlay.service";
import {NativeToastService} from "../../service/nativeToastService/native-toast.service";
import {FavoritosService} from "../../service/favoritosService/favoritos.service";
import {SeguidoresService} from "../../service/seguidoresService/seguidores.service";
import {EstiloPickerModalComponent} from "../../components/estilo-picker-modal/estilo-picker-modal.component";
import {TallaCamisetaPickerModalComponent} from "../../components/talla-camiseta-picker-modal/talla-camiseta-picker-modal.component";
import {TallaPantalonPickerModalComponent} from "../../components/talla-pantalon-picker-modal/talla-pantalon-picker-modal.component";
import {TallaCalzadoPickerModalComponent} from "../../components/talla-calzado-picker-modal/talla-calzado-picker-modal.component";

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
    PublicacionesPasadasComponent,
    OpcionesPrefilComponent,
    CartaHorizontalIntercambioComponent,
    TarjetaSeguidorComponent
  ]
})
export class PerfilPage implements OnInit, ViewWillEnter {

  usuario = signal<UsuarioDTO | null>(null);
  usuarioEstadisticas = signal<UsuarioEstadisticasDTO | null>(null);
  esMiPerfil = signal<boolean>(true);
  tabActivo = signal<string>('activas');

  favoritos = signal<ProductoDTO[]>([]);
  segmentoFavs: 'intercambios' | 'prestamos' = 'intercambios';

  seguidores = signal<UsuarioDTO[]>([]);
  siguiendo = signal<UsuarioDTO[]>([]);
  segmentoSeg: 'seguidores' | 'siguiendo' = 'seguidores';

  get favsFiltrados(): ProductoDTO[] {
    const tipo = this.segmentoFavs === 'intercambios' ? 'intercambio' : 'préstamo';
    return this.favoritos().filter(p => p.tipo?.toLowerCase() === tipo);
  }

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private overlayService = inject(OverlayService);
  private toast = inject(NativeToastService);
  private favoritosService = inject(FavoritosService);
  private seguidoresService = inject(SeguidoresService);
  private route = inject(ActivatedRoute);

  getEstilos(): string[] {
    const estilo = this.usuario()?.estilo ?? this.usuarioEstadisticas()?.estilo;
    if (!estilo) return [];
    return estilo.split(',').map(s => s.trim()).filter(Boolean);
  }

  eliminarEstilo(est: string) {
    const estilos = this.getEstilos().filter(e => e !== est);
    this.guardarEstilos(estilos);
  }

  agregarEstilo() {
    this.overlayService.open(EstiloPickerModalComponent, {}, (seleccionado: string | null) => {
      if (!seleccionado) return;
      const estilos = this.getEstilos();
      if (!estilos.includes(seleccionado)) {
        this.guardarEstilos([...estilos, seleccionado]);
      }
    });
  }

  private guardarEstilos(estilos: string[]) {
    const u = this.usuario();
    if (!u?.id) return;
    const actualizado = { ...u, estilo: estilos.join(', ') };
    this.usuarioService.updateUsuario(u.id, actualizado).subscribe({
      next: (usuarioGuardado) => {
        this.usuario.set(usuarioGuardado);
        this.toast.show('Estilos guardados');
      },
      error: () => this.toast.show('Error al guardar estilos')
    });
  }

  elegirTalla(tipo: 'tCamiseta' | 'tPantalon' | 'tCalzado') {
    const componente: Type<any> =
      tipo === 'tCamiseta' ? TallaCamisetaPickerModalComponent :
      tipo === 'tPantalon' ? TallaPantalonPickerModalComponent :
                              TallaCalzadoPickerModalComponent;

    this.overlayService.open(componente, {}, (talla: string | null) => {
      if (!talla) return;
      const u = this.usuario();
      if (!u?.id) return;
      const valor = tipo === 'tCamiseta' ? talla : Number(talla);
      const actualizado = { ...u, [tipo]: valor };
      this.usuarioService.updateUsuario(u.id, actualizado).subscribe({
        next: (usuarioGuardado) => {
          this.usuario.set(usuarioGuardado);
          this.toast.show('Talla guardada');
        },
        error: () => this.toast.show('Error al guardar talla')
      });
    });
  }

  ngOnInit() {
    this.cargarPerfil();
  }

  ionViewWillEnter() {
    this.cargarPerfil();
  }

  private cargarPerfil() {
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
    this.cargarFavoritos(idUsuario);
    this.cargarSeguidores(idUsuario);
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

  private cargarFavoritos(idUsuario: number) {
    this.favoritosService.getFavoritosByUsuario(idUsuario).subscribe({
      next: (prods) => this.favoritos.set(prods),
      error: (err) => console.error('Error al cargar favoritos:', err)
    });
  }

  private cargarSeguidores(idUsuario: number) {
    this.seguidoresService.getSeguidores(idUsuario).subscribe({
      next: (s) => this.seguidores.set(s),
      error: (err) => console.error('Error al cargar seguidores:', err)
    });
    this.seguidoresService.getSiguiendo(idUsuario).subscribe({
      next: (s) => this.siguiendo.set(s),
      error: (err) => console.error('Error al cargar siguiendo:', err)
    });
  }

}
