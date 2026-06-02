import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatosAdicionalesChipComponent } from './datos-adicionales-chip.component';

describe('DatosAdicionalesChipComponent', () => {
  let component: DatosAdicionalesChipComponent;
  let fixture: ComponentFixture<DatosAdicionalesChipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DatosAdicionalesChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAdicionalesChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
