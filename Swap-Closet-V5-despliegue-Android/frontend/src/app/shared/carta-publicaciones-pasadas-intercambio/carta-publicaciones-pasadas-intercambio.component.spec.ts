import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaPublicacionesPasadasIntercambioComponent } from './carta-publicaciones-pasadas-intercambio.component';

describe('CartaPublicacionesPasadasIntercambioComponent', () => {
  let component: CartaPublicacionesPasadasIntercambioComponent;
  let fixture: ComponentFixture<CartaPublicacionesPasadasIntercambioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaPublicacionesPasadasIntercambioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaPublicacionesPasadasIntercambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
