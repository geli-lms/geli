import { TestBed, inject } from '@angular/core/testing';

import { SelectedUnitsService } from './selected-units.service';

describe('SelectedUnitsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedUnitsService]
    });
  });

  it('should be created', inject([SelectedUnitsService], (service: SelectedUnitsService) => {
    expect(service).toBeTruthy();
  }));
});
