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

  it('should have been called with dismiss and default duration', async () => {
    const matSnackBar: MatSnackBar = TestBed.get(MatSnackBar);

    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    snackBar.open('awesome message');

    await expect(matSnackBar.open)
      .toHaveBeenCalledWith('awesome message', 'Dismiss', {duration: SnackBarService.defaultDuration});
  });

  it('should have been called with dismiss and short duration', async () => {
    const matSnackBar: MatSnackBar = TestBed.get(MatSnackBar);

    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    snackBar.openShort('awesome short message');

    await expect(matSnackBar.open)
      .toHaveBeenCalledWith('awesome short message', 'Dismiss', {duration: SnackBarService.durationShort});
  });

  it('should have been called with dismiss and long duration', async () => {
    const matSnackBar: MatSnackBar = TestBed.get(MatSnackBar);

    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    snackBar.openLong('awesome long message');

    await expect(matSnackBar.open)
      .toHaveBeenCalledWith('awesome long message', 'Dismiss', {duration: SnackBarService.durationLong});
  });

});
