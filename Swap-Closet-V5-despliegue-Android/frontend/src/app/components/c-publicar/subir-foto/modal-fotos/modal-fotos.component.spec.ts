import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalFotosComponent } from './modal-fotos.component';

describe('ModalFotosComponent', () => {
  let component: ModalFotosComponent;
  let fixture: ComponentFixture<ModalFotosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalFotosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
