import { TestBed, inject } from '@angular/core/testing';

import { UnitFormService } from './unit-form.service';

describe('UnitFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitFormService]
    });
  });

  it('should be created', inject([UnitFormService], (service: UnitFormService) => {
    expect(service).toBeTruthy();
  }));
});
