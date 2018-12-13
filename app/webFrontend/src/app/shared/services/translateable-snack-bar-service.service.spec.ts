import {TestBed} from '@angular/core/testing';

import {TranslatableSnackBarServiceService} from './translatable-snack-bar-service.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SnackBarService} from './snack-bar.service';

describe('TranslatableSnackBarServiceService', () => {

  beforeEach(() => {
    const snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['open']);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslatableSnackBarServiceService,
        {provide: SnackBarService, useValue: snackBarServiceSpy},
        TranslateService,
      ]
    });
  });

  it('should have been called with dismiss and default duration', async () => {
    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    const translate: TranslateService = TestBed.get(TranslateService);

    translate.use('en');
    translate.setTranslation('en', {
      'awesome message': 'translated awesome message',
      'awesome message from {{user}}': 'translated awesome message from {{user}}',
    });

    const translatableSnackBar: TranslatableSnackBarServiceService = TestBed.get(TranslatableSnackBarServiceService);

    translatableSnackBar.open(['awesome message']);
    await expect(snackBar.open)
      .toHaveBeenCalledWith('translated awesome message', SnackBarService.defaultDuration);

    translatableSnackBar.open(['awesome message from {{user}}'], {user: 'max'});
    await expect(snackBar.open)
      .toHaveBeenCalledWith('translated awesome message from max', SnackBarService.defaultDuration);
  });

  it('should have been called with dismiss and short duration', async () => {
    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    const translate: TranslateService = TestBed.get(TranslateService);

    translate.use('en');
    translate.setTranslation('en', {
      'awesome short message': 'translated awesome short message',
    });

    const translatableSnackBar: TranslatableSnackBarServiceService = TestBed.get(TranslatableSnackBarServiceService);
    translatableSnackBar.openShort(['awesome short message']);

    await expect(snackBar.open)
      .toHaveBeenCalledWith('translated awesome short message', SnackBarService.durationShort);
  });

  it('should have been called with dismiss and long duration', async () => {
    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    const translate: TranslateService = TestBed.get(TranslateService);

    translate.use('en');
    translate.setTranslation('en', {
      'awesome long message': 'translated awesome long message',
    });


    const translatableSnackBar: TranslatableSnackBarServiceService = TestBed.get(TranslatableSnackBarServiceService);
    translatableSnackBar.openLong(['awesome long message']);

    await expect(snackBar.open)
      .toHaveBeenCalledWith('translated awesome long message', SnackBarService.durationLong);

  });

});
