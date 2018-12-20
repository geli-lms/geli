import {Injectable} from '@angular/core';
import {SnackBarService} from './snack-bar.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatableSnackBarService {

  /**
   * @param snackBarService
   * @param translateService
   */
  constructor(private snackBarService: SnackBarService, private translateService: TranslateService) {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateService.get('snackbarMessages.dismiss').subscribe((res: string) => {
        this.snackBarService.setDefaultAction(res);
      });
    });
  }

  /**
   * Emit snackbar with given duration
   * @param {string} key
   * @param {Object} interpolateParams
   * @param {number} duration
   */
  open(key: string, interpolateParams: Object = {}, duration: number = SnackBarService.defaultDuration): void {
    this.translateService.get(key, interpolateParams).subscribe((message: string) => {
      this.snackBarService.open(message, duration);
    });
  }

  /**
   * Emit snackbar with duration short
   * @param {string} key
   * @param {Object} interpolateParams
   */
  openShort(key: string, interpolateParams: Object = {}): void {
    this.open(key, interpolateParams, SnackBarService.durationShort);
  }

  /**
   * Emit snackbar with duration long
   * @param {string} key
   * @param {Object} interpolateParams
   */
  openLong(key: string, interpolateParams: Object = {}): void {
    this.open(key, interpolateParams, SnackBarService.durationLong);
  }
}
