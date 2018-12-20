import {TestBed} from '@angular/core/testing';

import {TranslatableSnackBarService} from './translatable-snack-bar.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SnackBarService} from './snack-bar.service';

describe('TranslatableSnackBarService', () => {

  beforeEach(() => {
    const snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['open']);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslatableSnackBarService,
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

    const translatableSnackBar: TranslatableSnackBarService = TestBed.get(TranslatableSnackBarService);

    translatableSnackBar.open('awesome message');
    await expect(snackBar.open)
      .toHaveBeenCalledWith('translated awesome message', SnackBarService.defaultDuration);

    translatableSnackBar.open('awesome message from {{user}}', {user: 'max'});
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

    const translatableSnackBar: TranslatableSnackBarService = TestBed.get(TranslatableSnackBarService);
    translatableSnackBar.openShort('awesome short message');

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


    const translatableSnackBar: TranslatableSnackBarService = TestBed.get(TranslatableSnackBarService);
    translatableSnackBar.openLong('awesome long message');

    await expect(snackBar.open)
      .toHaveBeenCalledWith('translated awesome long message', SnackBarService.durationLong);

  });

});
