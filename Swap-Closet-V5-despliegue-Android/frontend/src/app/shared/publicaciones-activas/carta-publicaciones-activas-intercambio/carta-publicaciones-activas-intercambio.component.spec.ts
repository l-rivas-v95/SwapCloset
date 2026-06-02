import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaPublicacionesActivasIntercambioComponent } from './carta-publicaciones-activas-intercambio.component';

describe('CartaPublicacionesActivasIntercambioComponent', () => {
  let component: CartaPublicacionesActivasIntercambioComponent;
  let fixture: ComponentFixture<CartaPublicacionesActivasIntercambioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaPublicacionesActivasIntercambioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaPublicacionesActivasIntercambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
