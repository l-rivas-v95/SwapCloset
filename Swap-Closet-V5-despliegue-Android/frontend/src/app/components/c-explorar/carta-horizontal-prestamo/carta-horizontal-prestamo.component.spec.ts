import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaHorizontalPrestamoComponent } from './carta-horizontal-prestamo.component';

describe('CartaHorizontalPrestamoComponent', () => {
  let component: CartaHorizontalPrestamoComponent;
  let fixture: ComponentFixture<CartaHorizontalPrestamoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaHorizontalPrestamoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaHorizontalPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
