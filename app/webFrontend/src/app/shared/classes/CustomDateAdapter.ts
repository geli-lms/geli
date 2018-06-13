import * as moment from 'moment';
import {NativeDateAdapter} from '@angular/material';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  format(date: Date, displayFormat: Object): string {
    return moment(date).format('YYYY-MM-DD HH:mm');
  }
}
