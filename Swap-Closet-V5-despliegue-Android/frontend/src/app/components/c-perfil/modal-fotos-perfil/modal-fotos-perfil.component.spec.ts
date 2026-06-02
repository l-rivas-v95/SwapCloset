import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalFotosPerfilComponent } from './modal-fotos-perfil.component';

describe('ModalFotosPerfilComponent', () => {
  let component: ModalFotosPerfilComponent;
  let fixture: ComponentFixture<ModalFotosPerfilComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalFotosPerfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFotosPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
