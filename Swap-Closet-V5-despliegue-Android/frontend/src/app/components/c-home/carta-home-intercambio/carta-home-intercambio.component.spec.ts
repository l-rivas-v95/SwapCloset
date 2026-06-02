import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaHomeIntercambioComponent } from './carta-home-intercambio.component';

describe('CartaHomeIntercambioComponent', () => {
  let component: CartaHomeIntercambioComponent;
  let fixture: ComponentFixture<CartaHomeIntercambioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaHomeIntercambioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaHomeIntercambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
