import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnuncioComponenteComponent } from './anuncio-componente.component';

describe('AnuncioComponenteComponent', () => {
  let component: AnuncioComponenteComponent;
  let fixture: ComponentFixture<AnuncioComponenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AnuncioComponenteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnuncioComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
