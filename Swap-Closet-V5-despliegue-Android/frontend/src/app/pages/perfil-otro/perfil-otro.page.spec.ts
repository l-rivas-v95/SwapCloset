import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilOtroPage } from './perfil-otro.page';

describe('PerfilOtroPage', () => {
  let component: PerfilOtroPage;
  let fixture: ComponentFixture<PerfilOtroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilOtroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
