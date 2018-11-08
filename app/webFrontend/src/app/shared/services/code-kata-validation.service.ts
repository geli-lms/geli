import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeKataValidationService {

  validate(codeToTest: string) {
    let result = false;
    let log = undefined;
    const origLogger = window.console.log;

    window.console.log = (msg) => {
      if (log === undefined) {
        log = '';
      }
      log += msg + '\n';
      origLogger(msg);
    };

    try {
      (() => {
        'use strict';
        // tslint:disable-next-line:no-eval
        result = eval(codeToTest);
      })();
    } catch (e) {
      const err = e.constructor('Error in evaled Script:' + e.message);
      err.lineNumber = e.lineNumber - err.lineNumber;
      const msg = 'Error: ' + e.message;
      // tslint:disable-next-line:no-console
      console.log(msg);
      console.error(err.message);
    }
    window.console.log = origLogger;
    return {result, log};
  }
}
