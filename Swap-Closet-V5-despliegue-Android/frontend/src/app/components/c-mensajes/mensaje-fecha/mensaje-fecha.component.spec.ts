import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MensajeFechaComponent } from './mensaje-fecha.component';

describe('MensajeFechaComponent', () => {
  let component: MensajeFechaComponent;
  let fixture: ComponentFixture<MensajeFechaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MensajeFechaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MensajeFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
