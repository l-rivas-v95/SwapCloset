import {Component, inject, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {ProductoService} from "../../service/productoService/producto.service";
import {CartaProductoDTO} from "../../modelos/CartaProductoDTO";
import {OverlayService} from "../../service/overlay/overlay.service";

@Component({
  selector: 'app-producto-picker-modal',
  templateUrl: './producto-picker-modal.component.html',
  styleUrls: ['./producto-picker-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProductoPickerModalComponent implements OnInit {
  @Input() usuarioId!: number;

  private productoService = inject(ProductoService);
  private router = inject(Router);
  private overlayService = inject(OverlayService);

  productos: CartaProductoDTO[] = [];
  cargando = true;

  ngOnInit() {
    this.productoService.getAllCartasProductosActivosAndIdUsuario(this.usuarioId).subscribe({
      next: (ps) => {
        this.productos = ps.filter(p => p.tipo?.toLowerCase().includes('intercambio'));
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  seleccionar(p: CartaProductoDTO) {
    this.overlayService.close({ id: p.productoId, titulo: p.titulo, urlImg: p.urlImgProducto });
  }

  verAnuncio(p: CartaProductoDTO) {
    this.overlayService.close(null);
    this.router.navigate(['/anuncio', p.productoId]);
  }

  dismiss() { this.overlayService.close(null); }
}
