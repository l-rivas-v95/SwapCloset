import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaChatProductoComponent } from './carta-chat-producto.component';

describe('CartaChatProductoComponent', () => {
  let component: CartaChatProductoComponent;
  let fixture: ComponentFixture<CartaChatProductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaChatProductoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaChatProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
