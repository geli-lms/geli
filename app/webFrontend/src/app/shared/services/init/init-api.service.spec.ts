import { TestBed, inject } from '@angular/core/testing';

import { InitApiService } from './init-api.service';

describe('InitApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitApiService]
    });
  });

  it('should be created', inject([InitApiService], (service: InitApiService) => {
    expect(service).toBeTruthy();
  }));
});
