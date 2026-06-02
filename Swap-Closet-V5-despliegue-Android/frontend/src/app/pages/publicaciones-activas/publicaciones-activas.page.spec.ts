import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionesActivasPage } from './publicaciones-activas.page';

describe('PublicacionesActivasPage', () => {
  let component: PublicacionesActivasPage;
  let fixture: ComponentFixture<PublicacionesActivasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionesActivasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
