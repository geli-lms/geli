/* tslint:disable:no-unused-variable */

import {TestBed} from '@angular/core/testing';
import {SnackBarService} from './snack-bar.service';
import {MatSnackBar} from '@angular/material';

describe('SnackBarService', () => {

  beforeEach(() => {
    const matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SnackBarService,
        {provide: MatSnackBar, useValue: matSnackBarSpy}
      ]
    });
  });

  it('should have been called with dismiss and default duration', () => {
    const matSnackBar: MatSnackBar = TestBed.get(MatSnackBar);

    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    snackBar.open('awesome message');

    expect(matSnackBar.open)
      .toHaveBeenCalledWith('awesome message', SnackBarService.defaultAction, {duration: SnackBarService.defaultDuration});
  });

  it('should have been called with dismiss and short duration', () => {
    const matSnackBar: MatSnackBar = TestBed.get(MatSnackBar);

    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    snackBar.openShort('awesome middle message');

    expect(matSnackBar.open)
      .toHaveBeenCalledWith('awesome middle message', SnackBarService.defaultAction, {duration: SnackBarService.durationShort});
  });

  it('should have been called with dismiss and long duration', () => {
    const matSnackBar: MatSnackBar = TestBed.get(MatSnackBar);

    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    snackBar.openLong('awesome long message');

    expect(matSnackBar.open)
      .toHaveBeenCalledWith('awesome long message', SnackBarService.defaultAction, {duration: SnackBarService.durationLong});
  });

});
