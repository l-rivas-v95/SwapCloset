import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BotonPublicarComponent } from './boton-publicar.component';

describe('BotonPublicarComponent', () => {
  let component: BotonPublicarComponent;
  let fixture: ComponentFixture<BotonPublicarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BotonPublicarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonPublicarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
