import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgForOf} from '@angular/common';
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";
import {Subscription} from "rxjs";
import {OverlayService} from "../../../service/overlay/overlay.service";
import {BottomSheetComponent} from "../../bottom-sheet/bottom-sheet.component";
import {EstiloPickerModalComponent} from "../../estilo-picker-modal/estilo-picker-modal.component";

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
  private overlayService = inject(OverlayService);
  private resetSub?: Subscription;

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

  abrirMenuExtra(tipo: 'categoria' | 'color' | 'estilo') {
    if (tipo === 'estilo') {
      this.overlayService.open(EstiloPickerModalComponent, {}, (seleccionado: string | null) => {
        if (!seleccionado) return;
        if (!this.estilos.includes(seleccionado)) this.estilos.push(seleccionado);
        if (!this.estilosSeleccionados.includes(seleccionado)) this.estilosSeleccionados.push(seleccionado);
        this.productoFormService.updateForm({ estilo: this.estilosSeleccionados.join(', ') });
      });
    }
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
