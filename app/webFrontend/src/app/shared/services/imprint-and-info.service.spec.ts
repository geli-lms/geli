import { TestBed, inject } from '@angular/core/testing';

import { ImprintAndInfoService } from './imprint-and-info.service';

describe('ImprintAndInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImprintAndInfoService]
    });
  });

  it('should be created', inject([ImprintAndInfoService], (service: ImprintAndInfoService) => {
    expect(service).toBeTruthy();
  }));
});
