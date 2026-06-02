import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaPublicacionesPasadasIntercambiadoComponent } from './carta-publicaciones-pasadas-intercambiado.component';

describe('CartaPublicacionesPasadasIntercambiadoComponent', () => {
  let component: CartaPublicacionesPasadasIntercambiadoComponent;
  let fixture: ComponentFixture<CartaPublicacionesPasadasIntercambiadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaPublicacionesPasadasIntercambiadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaPublicacionesPasadasIntercambiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
