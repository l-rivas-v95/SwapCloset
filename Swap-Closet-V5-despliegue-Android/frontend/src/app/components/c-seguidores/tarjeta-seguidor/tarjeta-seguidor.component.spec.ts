import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TarjetaSeguidorComponent } from './tarjeta-seguidor.component';

describe('TarjetaSeguidorComponent', () => {
  let component: TarjetaSeguidorComponent;
  let fixture: ComponentFixture<TarjetaSeguidorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TarjetaSeguidorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaSeguidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
