import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubirFotoComponent } from './subir-foto.component';

describe('SubirFotoComponent', () => {
  let component: SubirFotoComponent;
  let fixture: ComponentFixture<SubirFotoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SubirFotoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubirFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
