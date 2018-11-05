import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeKataValidationService {

  validate(codeToTest: string) {
    let result = false;
    let log = '';

    try {
      result = eval(codeToTest);
    }
    catch (e) {
      const err = e.constructor('Error in evaled Script:' + e.message);
      err.lineNumber = e.lineNumber - err.lineNumber;
      log = log + err + '\n';
    }
    return {result, log};
  }
}
