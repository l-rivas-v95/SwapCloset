import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaChatComponent } from './carta-chat.component';

describe('CartaChatComponent', () => {
  let component: CartaChatComponent;
  let fixture: ComponentFixture<CartaChatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
