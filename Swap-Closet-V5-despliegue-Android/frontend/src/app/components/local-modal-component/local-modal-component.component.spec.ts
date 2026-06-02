import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocalModalComponentComponent } from './local-modal-component.component';

describe('LocalModalComponentComponent', () => {
  let component: LocalModalComponentComponent;
  let fixture: ComponentFixture<LocalModalComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LocalModalComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
