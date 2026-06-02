import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicacionesActivasComponent } from './publicaciones-activas.component';

describe('PublicacionesActivasComponent', () => {
  let component: PublicacionesActivasComponent;
  let fixture: ComponentFixture<PublicacionesActivasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PublicacionesActivasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionesActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
