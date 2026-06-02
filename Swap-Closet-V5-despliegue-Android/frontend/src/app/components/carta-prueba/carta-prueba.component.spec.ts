import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaPruebaComponent } from './carta-prueba.component';

describe('CartaPruebaComponent', () => {
  let component: CartaPruebaComponent;
  let fixture: ComponentFixture<CartaPruebaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaPruebaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
