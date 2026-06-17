import {Component, inject, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {ProductoService} from "../../service/productoService/producto.service";
import {CartaProductoDTO} from "../../modelos/CartaProductoDTO";

@Component({
  selector: 'app-producto-picker-modal',
  templateUrl: './producto-picker-modal.component.html',
  styleUrls: ['./producto-picker-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProductoPickerModalComponent implements OnInit {

  @Input() usuarioId!: number;

  productos: CartaProductoDTO[] = [];
  cargando = true;

  private modalCtrl = inject(ModalController);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  ngOnInit() {
    this.productoService.getAllCartasProductosActivosAndIdUsuario(this.usuarioId).subscribe({
      next: (ps) => {
        // Solo mostrar prendas de tipo Intercambio
        this.productos = ps.filter(p => p.tipo?.toLowerCase().includes('intercambio'));
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  seleccionar(p: CartaProductoDTO) {
    this.modalCtrl.dismiss({ id: p.productoId, titulo: p.titulo, urlImg: p.urlImgProducto });
  }

  verAnuncio(p: CartaProductoDTO) {
    this.modalCtrl.dismiss(null).then(() => {
      this.router.navigate(['/anuncio', p.productoId]);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss(null);
  }
}
