import * as moment from 'moment';
import {NativeDateAdapter} from '@angular/material';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Platform} from '@angular/cdk/platform';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  constructor(private translate: TranslateService, platform: Platform) {
    super(translate.currentLang, platform);
  }

  format(date: Date, displayFormat: Object): string {
    moment.locale(this.translate.currentLang);
    return moment(date).format('L');
  }
}
