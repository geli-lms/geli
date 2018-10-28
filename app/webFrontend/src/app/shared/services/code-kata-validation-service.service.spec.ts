import { TestBed, inject } from '@angular/core/testing';

import { CodeKataValidationService } from './code-kata-validation.service';

describe('CodeKataValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeKataValidationService]
    });
  });

  it('should be created', inject([CodeKataValidationService], (service: CodeKataValidationService) => {
    expect(service).toBeTruthy();
  }));
});
