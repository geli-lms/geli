import {Injectable} from '@angular/core';
import {SnackBarService} from './snack-bar.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatableSnackBarServiceService {

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
   * @param {string} message
   * @param {number} duration
   */
  open(message: string, duration: number = SnackBarService.defaultDuration): void {
    this.translateService.get(message).subscribe((res: string) => {
      console.log(message);
      console.log(res);
      this.snackBarService.open(res, duration);
    });
  }

  /**
   * Emit snackbar with duration short
   * @param {string} message
   */
  openShort(message: string): void {
    this.translateService.get(message).subscribe((res: string) => {
      this.snackBarService.openShort(res);
    });
  }

  /**
   * Emit snackbar with duration long
   * @param {string} message
   */
  openLong(message: string): void {
    this.translateService.get(message).subscribe((res: string) => {
      this.snackBarService.openLong(res);
    });
  }
}
