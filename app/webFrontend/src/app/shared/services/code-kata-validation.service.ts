import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeKataValidationService {

  validate(codeToTest: string) {
    let result = false;
    let log = undefined;

    window.console.log = (msg) => {
      if (log === undefined) {
        log = '';
      }
      log += msg + '\n';
      // tslint:disable-next-line:no-console
      console.log(msg);
    };

    try {
      // tslint:disable-next-line:no-eval
      result = eval(codeToTest);
    } catch (e) {
      const err = e.constructor('Error in evaled Script:' + e.message);
      err.lineNumber = e.lineNumber - err.lineNumber;
      log = log + err + '\n';
      // tslint:disable-next-line:no-console
      console.error(err.message);
    }
    return {result, log};
  }
}
