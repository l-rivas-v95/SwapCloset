import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OpcionesPerfilComponent } from './opciones-perfil.component';

describe('OpcionesPerfilComponent', () => {
  let component: OpcionesPerfilComponent;
  let fixture: ComponentFixture<OpcionesPerfilComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OpcionesPerfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpcionesPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
