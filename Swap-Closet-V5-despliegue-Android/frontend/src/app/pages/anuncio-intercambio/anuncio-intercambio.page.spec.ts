import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnuncioIntercambioPage } from './anuncio-intercambio.page';

describe('AnuncioIntercambioPage', () => {
  let component: AnuncioIntercambioPage;
  let fixture: ComponentFixture<AnuncioIntercambioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnuncioIntercambioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
