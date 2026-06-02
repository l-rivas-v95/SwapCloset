import { TestBed } from '@angular/core/testing';

import { ImagenFormService } from './imagen-form.service';

describe('ImagenFormService', () => {
  let service: ImagenFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
