import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';
import {SimpleSnackBar} from '@angular/material/snack-bar/typings/simple-snack-bar';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class SnackBarService {

  public static readonly durationShort = 3000;
  public static readonly durationLong = 9000;
  public static readonly defaultDuration = 6000;
  public defaultAction;

  /**
   * @param {MatSnackBar} matSnackBar
   */
  constructor(private matSnackBar: MatSnackBar,
              private translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => {
      this.setButtonLabel();
    });
    this.setButtonLabel();
  }

  setButtonLabel(): void {
    this.translate.get(['snackbarMessages.dismiss']).subscribe((t: string) => {
      this.defaultAction = t['snackbarMessages.dismiss'];
    });
  }

  /**
   * Return snackbar object with given duration
   * @param {string} message
   * @param {number} duration
   * @returns {MatSnackBarRef<SimpleSnackBar>}
   */
  open(message: string, duration: number = SnackBarService.defaultDuration): MatSnackBarRef<SimpleSnackBar> {
    return this.matSnackBar.open(message, this.defaultAction, {
      duration: duration
    });
  }

  /**
   * Return snackbar object with duration short
   * @param {string} message
   * @returns {MatSnackBarRef<SimpleSnackBar>}
   */
  openShort(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.open(message, SnackBarService.durationShort);
  }

  /**
   * Return snackbar object with duration long
   * @param {string} message
   * @returns {MatSnackBarRef<SimpleSnackBar>}
   */
  openLong(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.open(message, SnackBarService.durationLong);
  }
}
