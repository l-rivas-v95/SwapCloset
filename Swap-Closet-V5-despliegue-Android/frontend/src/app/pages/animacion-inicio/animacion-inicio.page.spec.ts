import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimacionInicioPage } from './animacion-inicio.page';

describe('AnimacionInicioPage', () => {
  let component: AnimacionInicioPage;
  let fixture: ComponentFixture<AnimacionInicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimacionInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
