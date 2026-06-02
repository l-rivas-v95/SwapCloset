import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartaHorizontalFavComponent } from './carta-horizontal-fav.component';

describe('CartaHorizontalFavComponent', () => {
  let component: CartaHorizontalFavComponent;
  let fixture: ComponentFixture<CartaHorizontalFavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CartaHorizontalFavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartaHorizontalFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
