/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {ShowProgressService} from './show-progress.service';

describe('ShowProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowProgressService]
    });
  });

  it('should ...', inject([ShowProgressService], (service: ShowProgressService) => {
    expect(service).toBeTruthy();
  }));
});
