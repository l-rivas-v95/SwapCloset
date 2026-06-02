import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DateModalComponentComponent } from './date-modal-component.component';

describe('DateModalComponentComponent', () => {
  let component: DateModalComponentComponent;
  let fixture: ComponentFixture<DateModalComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DateModalComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
