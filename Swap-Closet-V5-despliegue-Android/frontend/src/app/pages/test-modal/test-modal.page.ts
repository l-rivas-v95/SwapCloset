import {
  Component, ChangeDetectorRef, ElementRef, EnvironmentInjector,
  inject, NgZone, ViewChild
} from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-test-modal',
  templateUrl: './test-modal.page.html',
  styleUrls: ['./test-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class TestModalPage {

  private modalCtrl   = inject(ModalController);
  private toastCtrl   = inject(ToastController);
  private envInjector = inject(EnvironmentInjector);
  private ngZone      = inject(NgZone);
  private cdr         = inject(ChangeDetectorRef);

  // ── Estado de cada botón ──────────────────────────────────
  isOpen1 = false;   // A: [isOpen] sin keepContentsMounted
  isOpen2 = false;   // B: [isOpen] + keepContentsMounted
  isOpen3 = false;   // E: overlay custom @if
  toastDeclarativoOpen = false;
  toastCustomVisible = false;
  log = '';

  @ViewChild('modal4ref') modal4ref!: any;   // D: ViewChild + present()

  // ── A: [isOpen] sin keepContentsMounted ──────────────────
  abrirA() { this.isOpen1 = true; this.addLog('A abierto'); }

  // ── B: [isOpen] + keepContentsMounted ────────────────────
  abrirB() { this.isOpen2 = true; this.addLog('B abierto'); }

  // ── C: ModalController sin injector ──────────────────────
  async abrirC() {
    this.addLog('C: creando modal...');
    try {
      const m = await this.modalCtrl.create({
        component: TestContentComponent
      });
      await m.present();
      this.addLog('C: presentado OK');
    } catch (e: any) {
      this.addLog('C ERROR: ' + e?.message);
    }
  }

  // ── D: ModalController + EnvironmentInjector ─────────────
  async abrirD() {
    this.addLog('D: creando modal con injector...');
    try {
      const m = await this.modalCtrl.create({
        component: TestContentComponent,
        injector: this.envInjector
      } as any);
      await m.present();
      this.addLog('D: presentado OK');
    } catch (e: any) {
      this.addLog('D ERROR: ' + e?.message);
    }
  }

  // ── E: ViewChild + present() ─────────────────────────────
  abrirE() {
    this.addLog('E: llamando present()...');
    this.modal4ref?.present().then(() => this.addLog('E: presente OK'))
      .catch((e: any) => this.addLog('E ERROR: ' + e?.message));
  }

  // ── F: Custom overlay @if ────────────────────────────────
  abrirF() { this.isOpen3 = true; this.addLog('F abierto'); }

  // ── TOAST T1: ToastController position bottom ────────────
  async toastT1() {
    this.addLog('T1: toast bottom...');
    const t = await this.toastCtrl.create({ message: 'T1 — bottom', duration: 3000, position: 'bottom' });
    await t.present();
    this.addLog('T1: present() llamado');
  }

  // ── TOAST T2: ToastController position top ───────────────
  async toastT2() {
    this.addLog('T2: toast top...');
    const t = await this.toastCtrl.create({ message: 'T2 — top', duration: 3000, position: 'top' });
    await t.present();
    this.addLog('T2: present() llamado');
  }

  // ── TOAST T3: ToastController position middle ────────────
  async toastT3() {
    this.addLog('T3: toast middle...');
    const t = await this.toastCtrl.create({ message: 'T3 — middle', duration: 3000, position: 'middle' });
    await t.present();
    this.addLog('T3: present() llamado');
  }

  // ── TOAST T4: alert() nativo JS ──────────────────────────
  toastT4() {
    this.addLog('T4: alert() nativo');
    alert('T4 — alert() nativo JS');
    this.addLog('T4: alert cerrado');
  }

  // ── TOAST T5: ion-toast declarativo [isOpen] ─────────────
  toastT5() {
    this.addLog('T5: ion-toast declarativo');
    this.toastDeclarativoOpen = true;
  }

  // ── TOAST T6: div custom sin Ionic ───────────────────────
  toastT6() {
    this.addLog('T6: toast custom CSS');
    this.toastCustomVisible = true;
    setTimeout(() => { this.toastCustomVisible = false; }, 3000);
  }

  addLog(msg: string) {
    const t = new Date().toLocaleTimeString();
    this.log = `[${t}] ${msg}\n` + this.log;
  }
}

// Componente de contenido de prueba (inline para no crear otro archivo)
@Component({
  selector: 'app-test-content',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>FUNCIONA ✅</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>El modal se abrió correctamente</h2>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class TestContentComponent {
  private modalCtrl = inject(ModalController);
  cerrar() { this.modalCtrl.dismiss(); }
}
