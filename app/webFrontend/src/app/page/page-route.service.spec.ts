import { TestBed, inject } from '@angular/core/testing';

import { PageRouteService } from './page-route.service';

describe('PageRouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageRouteService]
    });
  });

  it('should be created', inject([PageRouteService], (service: PageRouteService) => {
    expect(service).toBeTruthy();
  }));
});
