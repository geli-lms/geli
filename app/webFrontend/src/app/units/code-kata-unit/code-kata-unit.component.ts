import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-code-kata',
  templateUrl: './code-kata-unit.component.html',
  styleUrls: ['./code-kata-unit.component.scss']
})
export class CodeKataComponent implements OnInit {
  @ViewChild('definitionEditor') definitionEditor;
  @ViewChild('codeEditor') codeEditor;
  @ViewChild('testEditor') testEditor;

  complete: string = '// Task: Manipulate the targetSet, so it only contains the values \"Hello\" and \"h_da\"\n\nlet targetSet = new Set([\"Hello\", \"there\"]);\n//####################\n\ntargetSet.add(\"h_da\");\ntargetSet.delete(\"there\");\n\n//####################\n\nvalidate();\n\nfunction validate() {\n  return targetSet.has(\"Hello\") && targetSet.has(\"h_da\") && targetSet.size === 2;\n}';

  definition: string = 'definition';
  code: string = '';
  test: string = 'test';

  logs: string = 'none';

  constructor() {
  }

  ngOnInit() {
    const seperator: string = "\/\/#+";
    let firstSeperator: number = this.findFirstIndexOf(this.complete, seperator);
    let lastSeperator: number = this.findLastIndexOf(this.complete, seperator);

    this.definition = this.complete.substring(0, firstSeperator).trim();

    let tmp = this.complete.substring(lastSeperator, this.complete.length);
    this.test = tmp.slice(tmp.search("\n")).trim();
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

  private validate() {
    let codeToTest: string = this.definition + '\n' + this.code + '\n' + this.test;

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
  }

  private findFirstIndexOf(source: string, value: string): number {
    return source.search(value);
  }

  private findLastIndexOf(source: string, value: string): number {
    let regex = new RegExp(value, '');
    let i: number = -1;

    // limit execution time (prevent deadlocks)
    let j = 10;
    while (j > 0) {
      j--;
      let result = regex.exec(source.slice(++i));
      if (result != null) {
        i += result.index;
      }
      else {
        i--;
        break;
      }
    }
    return i;
  }
}
