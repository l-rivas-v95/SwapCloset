import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnuncioIntercambioComponent } from './anuncio-intercambio.component';

describe('AnuncioIntercambioComponent', () => {
  let component: AnuncioIntercambioComponent;
  let fixture: ComponentFixture<AnuncioIntercambioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AnuncioIntercambioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnuncioIntercambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
