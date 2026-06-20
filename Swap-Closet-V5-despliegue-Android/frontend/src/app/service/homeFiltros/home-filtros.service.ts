import { Injectable, signal } from '@angular/core';

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

@Injectable({ providedIn: 'root' })
export class HomeFiltrosService {

  categoriaFiltro = signal<string | null>(null);

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

  seleccionarCategoria(label: string): void {
    this.categoriaFiltro.set(this.categoriaFiltro() === label ? null : label);
  }

  matchProducto(p: any): boolean {
    const cat = this.categoriaFiltro();
    return !cat || norm(p.categoria ?? '') === norm(cat);
  }
}
