import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnit} from '../../../../models/CodeKataUnit';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-code-kata',
  templateUrl: './code-kata-unit.component.html',
  styleUrls: ['./code-kata-unit.component.scss']
})
export class CodeKataComponent implements OnInit {
  @Input() codeKata: CodeKataUnit;

  @ViewChild('definitionEditor') definitionEditor;
  @ViewChild('codeEditor') codeEditor;
  @ViewChild('testEditor') testEditor;

  logs: string;


  constructor(private snackBar: MdSnackBar) {
    this.logs = null;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.definitionEditor.setOptions({
      maxLines: Infinity
    });
    this.codeEditor.setOptions({
      maxLines: Infinity
    });
    this.testEditor.setOptions({
      maxLines: Infinity
    });
  }

  private submitProgress() {
    if (!this.validate()) {
      this.snackBar.open('Your code does not validate. Check logs for information', '', {duration: 3000});
    }

  }

  // refactor this to use the same as in code-kata-unit-form
  private validate() {
    const codeToTest: string = this.codeKata.definition + '\n' + this.codeKata.code + '\n' + this.codeKata.test;

    this.logs = '';
    (<any>window).geli = {logs: ''};
    const origLogger = window.console.log;
    window.console.log = function (msg) {
      (<any>window).geli.logs += msg + '\n';
      origLogger(msg);
    };
    const origErrorLogger = window.console.error;
    window.console.error = function (msg) {
      (<any>window).geli.logs += msg + '\n';
      origErrorLogger(msg);
    };

    window.onerror = function (message, url, linenumber) {
      console.log(message);
      console.log(linenumber);
    };

    console.log((<any>window).geli.logs);
    this.logs = (<any>window).geli.logs;

    const result = eval(codeToTest);

    window.console.log = origLogger;
    window.console.error = origErrorLogger;

    if (result === true || result === undefined) {
      return true;
    }
    else {
      console.log(result);
      return false;
    }
  }
}
