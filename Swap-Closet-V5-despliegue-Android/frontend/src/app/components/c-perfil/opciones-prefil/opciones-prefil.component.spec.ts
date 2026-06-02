import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OpcionesPrefilComponent } from './opciones-prefil.component';

describe('OpcionesPrefilComponent', () => {
  let component: OpcionesPrefilComponent;
  let fixture: ComponentFixture<OpcionesPrefilComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OpcionesPrefilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpcionesPrefilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
