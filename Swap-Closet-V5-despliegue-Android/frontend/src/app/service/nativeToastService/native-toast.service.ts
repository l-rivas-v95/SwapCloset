import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NativeToastService {

  private queue: Array<{ msg: string; duration: number }> = [];
  private active = false;

  show(message: string, duration = 3000) {
    this.queue.push({ msg: message, duration });
    if (!this.active) this.next();
  }

  private next() {
    if (this.queue.length === 0) { this.active = false; return; }
    this.active = true;
    const { msg, duration } = this.queue.shift()!;

    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position:     'fixed',
      bottom:       '120px',        // por encima del tab bar
      left:         '50%',
      transform:    'translateX(-50%)',
      background:   'rgba(30,30,30,0.92)',
      color:        '#fff',
      padding:      '12px 22px',
      borderRadius: '24px',
      zIndex:       '99999',
      fontSize:     '15px',
      maxWidth:     '80vw',
      textAlign:    'center',
      pointerEvents:'none',
      boxShadow:    '0 4px 12px rgba(0,0,0,0.3)',
      transition:   'opacity 0.2s',
      opacity:      '1',
    });

    document.body.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.remove();
        this.next();
      }, 250);
    }, duration);
  }
}
