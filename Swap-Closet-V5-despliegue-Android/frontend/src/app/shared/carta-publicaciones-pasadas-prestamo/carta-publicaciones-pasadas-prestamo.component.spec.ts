import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaPublicacionesPasadasPrestamoComponent } from './carta-publicaciones-pasadas-prestamo.component';

describe('CartaPublicacionesPasadasPrestamoComponent', () => {
  let component: CartaPublicacionesPasadasPrestamoComponent;
  let fixture: ComponentFixture<CartaPublicacionesPasadasPrestamoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaPublicacionesPasadasPrestamoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaPublicacionesPasadasPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
