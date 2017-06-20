import { Component, OnInit } from '@angular/core';
import {validate} from "codelyzer/walkerFactory/walkerFn";

@Component({
  selector: 'app-code-kata-unit-edit',
  templateUrl: './code-kata-unit-edit.component.html',
  styleUrls: ['./code-kata-unit-edit.component.scss']
})
export class CodeKataUnitEditComponent implements OnInit {

  code: string;
  logs: string;

  constructor() { }

  ngOnInit() {
  }

  private save() {
    if (this.validate()) {

    }
    else {
      // Fehler -> code muss validiert sein um unit zu erstellen.
    }
  }

  //refactor this to use the same as in code-kata-unit
  private validate() {
    let codeToTest: string = this.code;

    this.logs = '';
    (<any>window).geli = {logs: ''};
    let origLogger = window.console.log;
    window.console.log = function (msg) {
      (<any>window).geli.logs += msg + '\n';
      origLogger(msg);
    };
    let origErrorLogger = window.console.error;
    window.console.error = function (msg) {
      (<any>window).geli.logs += msg + '\n';
      origErrorLogger(msg);
    };

    window.onerror = function(message, url, linenumber) {
      console.log(message);
      console.log(linenumber);
    };

    console.log((<any>window).geli.logs);
    this.logs = (<any>window).geli.logs;

    let result = eval(codeToTest);

    window.console.log = origLogger;
    window.console.error = origErrorLogger;

    return result === 'undefined';
  }

}
