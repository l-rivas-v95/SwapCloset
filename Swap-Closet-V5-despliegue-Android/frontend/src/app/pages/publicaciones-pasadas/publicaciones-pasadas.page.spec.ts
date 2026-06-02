import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionesPasadasPage } from './publicaciones-pasadas.page';

describe('PublicacionesPasadasPage', () => {
  let component: PublicacionesPasadasPage;
  let fixture: ComponentFixture<PublicacionesPasadasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionesPasadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
