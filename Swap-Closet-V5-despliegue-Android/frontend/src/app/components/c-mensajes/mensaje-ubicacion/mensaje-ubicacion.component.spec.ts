import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MensajeUbicacionComponent } from './mensaje-ubicacion.component';

describe('MensajeUbicacionComponent', () => {
  let component: MensajeUbicacionComponent;
  let fixture: ComponentFixture<MensajeUbicacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MensajeUbicacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MensajeUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
