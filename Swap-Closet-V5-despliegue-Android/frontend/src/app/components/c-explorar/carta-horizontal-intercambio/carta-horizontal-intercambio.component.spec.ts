import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaHorizontalIntercambioComponent } from './carta-horizontal-intercambio.component';

describe('CartaHorizontalIntercambioComponent', () => {
  let component: CartaHorizontalIntercambioComponent;
  let fixture: ComponentFixture<CartaHorizontalIntercambioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaHorizontalIntercambioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaHorizontalIntercambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
