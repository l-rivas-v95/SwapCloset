import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BtnContactarComponent } from './btn-contactar.component';

describe('BtnContactarComponent', () => {
  let component: BtnContactarComponent;
  let fixture: ComponentFixture<BtnContactarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BtnContactarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnContactarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
