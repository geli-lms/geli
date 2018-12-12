import {TestBed} from '@angular/core/testing';

import {TranslatableSnackBarServiceService} from './translatable-snack-bar-service.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SnackBarService} from './snack-bar.service';

describe('TranslatableSnackBarServiceService', () => {

  beforeEach(() => {
    const snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['open', 'openShort', 'openLong']);

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

  it('should have been called with dismiss and default duration', () => {
    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    const translate: TranslateService = TestBed.get(TranslateService);

    translate.use('en');
    translate.setTranslation('en', {
      'awesome message': 'translated awesome message',
    });

    const translatableSnackBar: TranslatableSnackBarServiceService = TestBed.get(TranslatableSnackBarServiceService);
    translatableSnackBar.open('awesome message');

    expect(snackBar.open)
      .toHaveBeenCalledWith('translated awesome message', SnackBarService.defaultDuration);
  });

  it('should have been called with dismiss and short duration', () => {
    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    const translate: TranslateService = TestBed.get(TranslateService);

    translate.use('en');
    translate.setTranslation('en', {
      'awesome short message': 'translated awesome short message',
    });

    const translatableSnackBar: TranslatableSnackBarServiceService = TestBed.get(TranslatableSnackBarServiceService);
    translatableSnackBar.openShort('awesome short message');

    expect(snackBar.openShort)
      .toHaveBeenCalledWith('translated awesome short message');
  });

  it('should have been called with dismiss and long duration', () => {
    const snackBar: SnackBarService = TestBed.get(SnackBarService);
    const translate: TranslateService = TestBed.get(TranslateService);

    translate.use('en');
    translate.setTranslation('en', {
      'awesome long message': 'translated awesome long message',
    });


    const translatableSnackBar: TranslatableSnackBarServiceService = TestBed.get(TranslatableSnackBarServiceService);
    translatableSnackBar.openLong('awesome long message');

    expect(snackBar.openLong)
      .toHaveBeenCalledWith('translated awesome long message');
  });

});
