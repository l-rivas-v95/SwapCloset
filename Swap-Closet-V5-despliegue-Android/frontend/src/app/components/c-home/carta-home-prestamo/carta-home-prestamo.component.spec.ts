import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaHomePrestamoComponent } from './carta-home-prestamo.component';

describe('CartaHomePrestamoComponent', () => {
  let component: CartaHomePrestamoComponent;
  let fixture: ComponentFixture<CartaHomePrestamoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaHomePrestamoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaHomePrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
