import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';
import {SimpleSnackBar} from '@angular/material/snack-bar/typings/simple-snack-bar';

@Injectable()
export class SnackBarService {

  public static readonly durationShort = 3000;
  public static readonly durationLong = 9000;

  public static readonly defaultAction = 'Dismiss';
  public static readonly defaultDuration = 6000;

  /**
   * @param {MatSnackBar} matSnackBar
   */
  constructor(private matSnackBar: MatSnackBar) {
  }

  /**
   * Return snackbar object with given duration
   * @param {string} message
   * @param {number} duration
   * @returns {MatSnackBarRef<SimpleSnackBar>}
   */
  open(message: string, duration: number = SnackBarService.defaultDuration): MatSnackBarRef<SimpleSnackBar> {
    return this.matSnackBar.open(message, SnackBarService.defaultAction, {
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
