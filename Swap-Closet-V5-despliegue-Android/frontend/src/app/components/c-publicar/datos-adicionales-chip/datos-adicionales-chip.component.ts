import {Component, inject, OnInit} from '@angular/core';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { NgForOf} from '@angular/common';
import {ProductoFormService} from "../../../service/productoFormService/producto-form.service";

@Component({
  selector: 'app-datos-adicionales-chip',
  templateUrl: './datos-adicionales-chip.component.html',
  styleUrls: ['./datos-adicionales-chip.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf]
})
export class DatosAdicionalesChipComponent implements OnInit {

  // --- Opciones base ---
  categorias = ['Vestido', 'Top', 'Pantalón', 'Chaqueta', 'Calzado', 'Accesorios'];
  categoriasExtra = ['Abrigo', 'Falda', 'Sudadera', 'Camisa', 'Jersey'];

  tallasLetra = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  tallasNumero = ['36', '37', '38', '39', '40', '41', '42', '43', '44'];
  tallas: string[] = [...this.tallasLetra]; // cambia dinámicamente

  estados = ['Como nuevo', 'Excelente', 'Bueno', 'Muy bueno', 'Regular'];

  colores = ['Negro', 'Blanco', 'Verde', 'Amarillo', 'Azul', 'Marrón', 'Naranja'];
  coloresExtra = ['Rojo', 'Gris', 'Rosa', 'Beige', 'Morado'];

  estilos = ['Casual', 'Informal', 'Ocasional', 'Metal', 'Urbano', 'Fiesta'];
  estilosExtra = ['Vintage', 'Boho', 'Elegante', 'Minimal', 'Sport'];

  // --- Selecciones ---
  categoriaSeleccionada: string | null = this.categorias[0];
  tallaSeleccionada: string | null = this.tallas[0];
  estadoSeleccionado: string | null = this.estados[0];
  coloresSeleccionados: string[] = [this.colores[0]];
  estilosSeleccionados: string[] = [this.estilos[0]];

  private productoFormService = inject(ProductoFormService);

  constructor(private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    // Inicializar formulario con los valores por defecto
    this.productoFormService.updateForm({
      categoria: this.categoriaSeleccionada ?? undefined,
      talla: this.tallaSeleccionada ?? undefined,
      estado: this.estadoSeleccionado ?? undefined,
      color: this.coloresSeleccionados.join(', '),
      estilo: this.estilosSeleccionados.join(', ')
    });
  }

  // CATEGORÍA, TALLA y ESTADO
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
    console.log(`${tipo} seleccionada: ${this.categoriaSeleccionada || this.tallaSeleccionada || this.estadoSeleccionado}`);
  }

  // COLOR y ESTILO (múltiple)
  toggleSeleccion(lista: string[], valor: string, tipo: 'color' | 'estilo') {
    const index = lista.indexOf(valor);
    if (index > -1) {
      lista.splice(index, 1);
      console.log(`Se quitó: ${valor}`);
    } else {
      lista.push(valor);
      console.log(`Se añadió: ${valor}`);
    }

    // Actualizar el formulario con string
    if (tipo === 'color') {
      this.productoFormService.updateForm({ color: this.coloresSeleccionados.join(', ') });
    } else if (tipo === 'estilo') {
      this.productoFormService.updateForm({ estilo: this.estilosSeleccionados.join(', ') });
    }
  }

  //  Menú de añadir nuevas opciones
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

  // Actualiza tallas según categoría
  actualizarTallas() {
    if (this.categoriaSeleccionada === 'Pantalón' || this.categoriaSeleccionada === 'Calzado') {
      this.tallas = [...this.tallasNumero];
    } else {
      this.tallas = [...this.tallasLetra];
    }
    this.tallaSeleccionada = null; // Reiniciar selección de talla
  }
}
