import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ProgressService} from 'app/shared/services/data/progress.service';
import {ICodeKataUnitProgress} from '../../../../../../shared/models/progress/ICodeKataProgress';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {AceEditorComponent} from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';
import {ICodeKataUnit} from '../../../../../../shared/models/units/ICodeKataUnit';
import {CodeKataUnitProgress} from '../../models/progress/CodeKataUnitProgress';

@Component({
  selector: 'app-code-kata',
  templateUrl: './code-kata-unit.component.html',
  styleUrls: ['./code-kata-unit.component.scss']
})
export class CodeKataComponent implements OnInit {
  @Input() codeKataUnit: ICodeKataUnit;

  @ViewChild('definitionEditor')
  definitionEditor: AceEditorComponent;
  @ViewChild('codeEditor')
  codeEditor: AceEditorComponent;
  @ViewChild('testEditor')
  testEditor: AceEditorComponent;

  logs: string;
  progress: ICodeKataUnitProgress;
  isExampleCode = false;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private progressService: ProgressService,
              private userService: UserService) {
    this.logs = undefined;
  }

  ngOnInit() {
    this.isExampleCode = this.codeKataUnit.code !== null;
    if (!this.isExampleCode) {
      if (!this.codeKataUnit.progressData) {
        this.progress = new CodeKataUnitProgress(this.codeKataUnit);
      } else {
        this.progress = this.codeKataUnit.progressData;
      }
    }
  }

  ngAfterViewInit() {
    this.setOptions();
  }

  setOptions() {
    this.definitionEditor.setOptions({
      maxLines: 9999,
    });
    this.codeEditor.setOptions({
      maxLines: 9999,
      firstLineNumber: (this.codeKataUnit.definition.split('\n').length || 0) + 1,
    });
    this.testEditor.setOptions({
      maxLines: 9999,
      firstLineNumber: ((this.codeKataUnit.definition.split('\n').length || 0) +
        (this.codeEditor.text.split('\n').length || 0) + 1),
    });
  }

  async submitProgress() {
    this.progress.done = this.validate();
    if (!this.progress.done) {
      this.snackBar.open('Your code does not validate.', '', {duration: 3000});
    }

    if (!this.progress._id) {
      this.progress.user = this.userService.user._id;
      this.progressService.createItem(this.progress)
        .then((item) => {
          this.snackBar.open('Progress has been saved', '', {duration: 3000});
          this.progress = item;
        })
        .catch((err) => {
          this.snackBar.open(`An error occurred: ${err.json().message}`, '', {duration: 3000});
        });
    } else {
      this.progressService.updateItem(this.progress)
        .then((item) => {
          this.snackBar.open('Progress has been updated', '', {duration: 3000});
          this.progress = item;
        })
        .catch((err) => {
          this.snackBar.open(`An error occurred: ${err.json().message}`, '', {duration: 3000});
        });
    }
  }

  onUserInput() {
    this.setOptions();
  }

  // refactor this to use the same as in code-kata-unit-form
  validate() {
    const codeToTest: string = this.codeKataUnit.definition + '\n' + this.progress.code + '\n' + this.codeKataUnit.test;

    this.logs = undefined;

    const origLogger = window.console.log;
    window.console.log = (msg) => {
      if (this.logs === undefined) {
        this.logs = '';
      }
      this.logs += msg + '\n';
      origLogger(msg);
    };

    let result = false;
    try {
      // tslint:disable-next-line:no-eval
      result = eval(codeToTest);
    } catch (e) {
      const err = e.constructor('Error in Evaled Script: ' + e.message);
      err.lineNumber = e.lineNumber - err.lineNumber;

      const msg = 'Error: ' + e.message; //  + ' (line: ' + err.lineNumber + ')';
      // tslint:disable-next-line:no-console
      console.log(msg);
      console.error(err);
    }

    window.console.log = origLogger;

    if (result === true || result === undefined) {
      this.snackBar.open('Success', '', {duration: 3000});
      return true;
    } else {
      this.snackBar.open('Your code failed.', '', {duration: 3000});
      // tslint:disable-next-line:no-console
      console.log(result);
      return false;
    }
  }
}
