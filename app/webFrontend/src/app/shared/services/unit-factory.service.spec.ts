import { TestBed, inject } from '@angular/core/testing';

import { UnitFactoryService } from './unit-factory.service';

describe('UnitFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitFactoryService]
    });
  });

  it('should be created', inject([UnitFactoryService], (service: UnitFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
