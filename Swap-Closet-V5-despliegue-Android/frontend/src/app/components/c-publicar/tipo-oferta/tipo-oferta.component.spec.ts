import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipoOfertaComponent } from './tipo-oferta.component';

describe('TipoOfertaComponent', () => {
  let component: TipoOfertaComponent;
  let fixture: ComponentFixture<TipoOfertaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TipoOfertaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
