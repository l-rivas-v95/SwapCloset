import {Injectable, signal, Type} from '@angular/core';

export interface OverlayConfig {
  component: Type<any>;
  inputs: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  overlayConfig = signal<OverlayConfig | null>(null);
  private onCloseCb: ((data: any) => void) | null = null;

  open<T>(component: Type<T>, inputs: Record<string, any> = {}, onClose?: (data: any) => void) {
    this.onCloseCb = onClose ?? null;
    this.overlayConfig.set({ component, inputs });
  }

  close(data: any = null) {
    this.overlayConfig.set(null);
    const cb = this.onCloseCb;
    this.onCloseCb = null;
    cb?.(data);
  }
}
