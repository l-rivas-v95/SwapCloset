import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaPublicacionesActivasPrestamoComponent } from './carta-publicaciones-activas-prestamo.component';

describe('CartaPublicacionesActivasPrestamoComponent', () => {
  let component: CartaPublicacionesActivasPrestamoComponent;
  let fixture: ComponentFixture<CartaPublicacionesActivasPrestamoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaPublicacionesActivasPrestamoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaPublicacionesActivasPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
