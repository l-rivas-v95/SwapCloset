import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { NgForOf} from '@angular/common';
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-datos-adicionales-chip',
  templateUrl: './datos-adicionales-chip.component.html',
  styleUrls: ['./datos-adicionales-chip.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf]
})
export class DatosAdicionalesChipComponent implements OnInit, OnDestroy {

  categorias = ['Vestido', 'Top', 'Pantalón', 'Chaqueta', 'Calzado', 'Accesorios'];
  categoriasExtra = ['Abrigo', 'Falda', 'Sudadera', 'Camisa', 'Jersey'];

  tallasLetra = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  tallasNumero = ['36', '37', '38', '39', '40', '41', '42', '43', '44'];
  tallas: string[] = [...this.tallasLetra];

  estados = ['Como nuevo', 'Excelente', 'Bueno', 'Muy bueno', 'Regular'];

  colores = ['Negro', 'Blanco', 'Verde', 'Amarillo', 'Azul', 'Marrón', 'Naranja'];
  coloresExtra = ['Rojo', 'Gris', 'Rosa', 'Beige', 'Morado'];

  estilos = ['Casual', 'Informal', 'Ocasional', 'Metal', 'Urbano', 'Fiesta'];
  estilosExtra = ['Vintage', 'Boho', 'Elegante', 'Minimal', 'Sport'];

  categoriaSeleccionada: string | null = this.categorias[0];
  tallaSeleccionada: string | null = this.tallas[0];
  estadoSeleccionado: string | null = this.estados[0];
  coloresSeleccionados: string[] = [this.colores[0]];
  estilosSeleccionados: string[] = [this.estilos[0]];

  private productoFormService = inject(ProductoFormService);
  private resetSub?: Subscription;

  constructor(private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    this.inicializarValores();
    this.resetSub = this.productoFormService.reset$.subscribe(() => this.inicializarValores());
  }

  ngOnDestroy() {
    this.resetSub?.unsubscribe();
  }

  seleccionarUnico(tipo: 'categoria' | 'talla' | 'estado', valor: string) {
    if (tipo === 'categoria') {
      this.categoriaSeleccionada = this.categoriaSeleccionada === valor ? null : valor;
      this.actualizarTallas();
      this.productoFormService.updateForm({ categoria: this.categoriaSeleccionada ?? undefined });
    } else if (tipo === 'talla') {
      this.tallaSeleccionada = this.tallaSeleccionada === valor ? null : valor;
      this.productoFormService.updateForm({ talla: this.tallaSeleccionada ?? undefined });
    } else if (tipo === 'estado') {
      this.estadoSeleccionado = this.estadoSeleccionado === valor ? null : valor;
      this.productoFormService.updateForm({ estado: this.estadoSeleccionado ?? undefined });
    }
  }

  toggleSeleccion(lista: string[], valor: string, tipo: 'color' | 'estilo') {
    const index = lista.indexOf(valor);
    if (index > -1) {
      lista.splice(index, 1);
    } else {
      lista.push(valor);
    }

    if (tipo === 'color') {
      this.productoFormService.updateForm({ color: this.coloresSeleccionados.join(', ') });
    } else if (tipo === 'estilo') {
      this.productoFormService.updateForm({ estilo: this.estilosSeleccionados.join(', ') });
    }
  }

  async abrirMenuExtra(tipo: 'categoria' | 'color' | 'estilo') {
    let opciones: string[] = [];
    if (tipo === 'categoria') opciones = this.categoriasExtra;
    if (tipo === 'color') opciones = this.coloresExtra;
    if (tipo === 'estilo') opciones = this.estilosExtra;

    const botones = opciones.map(op => ({
      text: op,
      handler: () => {
        if (tipo === 'categoria') {
          if (!this.categorias.includes(op)) this.categorias.push(op);
          this.categoriaSeleccionada = op;
          this.actualizarTallas();
          this.productoFormService.updateForm({ categoria: op });
        }
        if (tipo === 'color') {
          if (!this.colores.includes(op)) this.colores.push(op);
          if (!this.coloresSeleccionados.includes(op)) this.coloresSeleccionados.push(op);
          this.productoFormService.updateForm({ color: this.coloresSeleccionados.join(', ') });
        }
        if (tipo === 'estilo') {
          if (!this.estilos.includes(op)) this.estilos.push(op);
          if (!this.estilosSeleccionados.includes(op)) this.estilosSeleccionados.push(op);
          this.productoFormService.updateForm({ estilo: this.estilosSeleccionados.join(', ') });
        }
      }
    }));

    const actionSheet = await this.actionSheetCtrl.create({
      header: `Añadir ${tipo}`,
      buttons: [...botones, { text: 'Cancelar', role: 'cancel' }] as any[]
    });

    await actionSheet.present();
  }

  actualizarTallas() {
    if (this.categoriaSeleccionada === 'Pantalón' || this.categoriaSeleccionada === 'Calzado') {
      this.tallas = [...this.tallasNumero];
    } else {
      this.tallas = [...this.tallasLetra];
    }
    this.tallaSeleccionada = null;
  }

  private inicializarValores() {
    this.tallas = [...this.tallasLetra];
    this.categoriaSeleccionada = this.categorias[0];
    this.tallaSeleccionada = this.tallas[0];
    this.estadoSeleccionado = this.estados[0];
    this.coloresSeleccionados = [this.colores[0]];
    this.estilosSeleccionados = [this.estilos[0]];

    this.productoFormService.updateForm({
      categoria: this.categoriaSeleccionada ?? undefined,
      talla: this.tallaSeleccionada ?? undefined,
      estado: this.estadoSeleccionado ?? undefined,
      color: this.coloresSeleccionados.join(', '),
      estilo: this.estilosSeleccionados.join(', ')
    });
  }
}
