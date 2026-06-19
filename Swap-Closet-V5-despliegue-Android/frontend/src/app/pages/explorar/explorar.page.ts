import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {CartaHorizontalIntercambioComponent} from "../../components/c-explorar/carta-horizontal-intercambio/carta-horizontal-intercambio.component";
import {RouterModule} from "@angular/router";
import {ProductoService} from "../../service/productoService/producto.service";
import {ProductoDTO} from "../../modelos/ProductoDTO";

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CartaHorizontalIntercambioComponent, RouterModule],
})
export class ExplorarPage implements OnInit {

  private productoService = inject(ProductoService);

  productos = signal<ProductoDTO[]>([]);
  busqueda     = signal<string>('');
  tipoFiltro   = signal<'todos' | 'intercambio' | 'prestamo'>('todos');
  categoriaFiltro = signal<string | null>(null);
  tallaFiltro  = signal<string | null>(null);
  estiloFiltro = signal<string | null>(null);

  pickerTalla     = signal(false);
  pickerEstilo    = signal(false);
  pickerCategoria = signal(false);

  readonly categorias: { label: string; alpha: string; solid: string }[] = [
    { label: 'Vestido',    alpha: 'rgba(255,63,191,0.18)',  solid: '#C0246E' },
    { label: 'Top',        alpha: 'rgba(124,58,237,0.18)',  solid: '#7C3AED' },
    { label: 'Pantalón',   alpha: 'rgba(63,66,255,0.18)',   solid: '#3F42FF' },
    { label: 'Chaqueta',   alpha: 'rgba(55,48,163,0.18)',   solid: '#3730A3' },
    { label: 'Calzado',    alpha: 'rgba(234,121,0,0.18)',   solid: '#EA7900' },
    { label: 'Accesorios', alpha: 'rgba(13,158,107,0.18)',  solid: '#0D9E6B' },
    { label: 'Abrigo',     alpha: 'rgba(13,122,122,0.18)',  solid: '#0D7A7A' },
    { label: 'Falda',      alpha: 'rgba(220,38,38,0.18)',   solid: '#DC2626' },
    { label: 'Sudadera',   alpha: 'rgba(46,107,138,0.18)',  solid: '#2E6B8A' },
    { label: 'Camisa',     alpha: 'rgba(0,119,204,0.18)',   solid: '#0077CC' },
    { label: 'Jersey',     alpha: 'rgba(176,125,0,0.18)',   solid: '#B07D00' },
  ];
  readonly tallasLetra  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  readonly tallasNumero = ['36', '37', '38', '39', '40', '41', '42', '43', '44'];
  readonly estilos      = ['Casual', 'Informal', 'Ocasional', 'Metal', 'Urbano',
                           'Fiesta', 'Vintage', 'Boho', 'Elegante', 'Minimal', 'Sport'];

  tallasActivas = computed(() => {
    const cat = norm(this.categoriaFiltro() ?? '');
    return (cat === 'calzado' || cat === 'pantalon')
      ? this.tallasNumero
      : this.tallasLetra;
  });

  productosFiltrados = computed(() => {
    const term      = norm(this.busqueda().trim());
    const tipo      = this.tipoFiltro();
    const categoria = this.categoriaFiltro();
    const talla     = this.tallaFiltro();
    const estilo    = this.estiloFiltro();

    return this.productos().filter(p => {
      const matchTipo      = tipo === 'todos' || norm(p.tipo ?? '') === norm(tipo);
      const matchCategoria = !categoria || norm(p.categoria ?? '') === norm(categoria);
      const matchTalla     = !talla  || norm(p.talla  ?? '') === norm(talla);
      const matchEstilo    = !estilo || norm(p.estilo ?? '').includes(norm(estilo));
      const matchBusqueda  = !term   ||
        norm(p.titulo    ?? '').includes(term) ||
        norm(p.marca     ?? '').includes(term) ||
        norm(p.categoria ?? '').includes(term) ||
        norm(p.tipo      ?? '').includes(term) ||
        norm(p.color     ?? '').includes(term) ||
        norm(p.estilo    ?? '').includes(term);
      return matchTipo && matchCategoria && matchTalla && matchEstilo && matchBusqueda;
    });
  });

  ngOnInit() { this.cargarProductos(); }

  cargarProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (prods) => this.productos.set(prods),
      error: (err)  => console.error('Error:', err)
    });
  }

  seleccionarCategoria(c: string) {
    const anterior = this.categoriaFiltro();
    const esNueva  = anterior !== c;
    this.categoriaFiltro.set(esNueva ? c : null);
    // Si cambia entre calzado/pantalón y ropa, resetear talla (incompatibles)
    const catNorm = (s: string | null) => norm(s ?? '');
    const eraNumero  = ['calzado','pantalon'].includes(catNorm(anterior));
    const seraNumero = ['calzado','pantalon'].includes(catNorm(c));
    if (eraNumero !== seraNumero) this.tallaFiltro.set(null);
    this.pickerCategoria.set(false);
  }

  getCatColor(label: string | null): { alpha: string; solid: string } | null {
    return this.categorias.find(c => c.label === label) ?? null;
  }

  seleccionarTalla(t: string) {
    this.tallaFiltro.set(this.tallaFiltro() === t ? null : t);
    this.pickerTalla.set(false);
  }

  seleccionarEstilo(e: string) {
    this.estiloFiltro.set(this.estiloFiltro() === e ? null : e);
    this.pickerEstilo.set(false);
  }
}
