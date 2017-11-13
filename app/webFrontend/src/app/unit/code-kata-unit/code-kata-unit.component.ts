import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnit} from '../../models/CodeKataUnit';
import {MatSnackBar} from '@angular/material';
import {ProgressService} from 'app/shared/services/data/progress.service';
import {ICodeKataProgress} from '../../../../../../shared/models/ICodeKataProgress';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {AceEditorComponent} from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';

@Component({
  selector: 'app-code-kata',
  templateUrl: './code-kata-unit.component.html',
  styleUrls: ['./code-kata-unit.component.scss']
})
export class CodeKataComponent implements OnInit {
  @Input() codeKata: CodeKataUnit;

  @ViewChild('definitionEditor')
  definitionEditor: AceEditorComponent;
  @ViewChild('codeEditor')
  codeEditor: AceEditorComponent;
  @ViewChild('testEditor')
  testEditor: AceEditorComponent;

  logs: string;
  progress: any;
  isExampleCode = false;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private progressService: ProgressService,
              private userService: UserService) {
    this.logs = undefined;
    this.progress = {course: '', unit: '', user: '', code: '', done: false};
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.progress.course = decodeURIComponent(params['id']);
      });
    this.isExampleCode = this.codeKata.code !== null;
    if (!this.isExampleCode) {
      this.loadProgress();
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
      firstLineNumber: (this.codeKata.definition.split('\n').length || 0) + 1,
    });
    this.testEditor.setOptions({
      maxLines: 9999,
      firstLineNumber: ((this.codeKata.definition.split('\n').length + this.progress.code.split('\n').length) || 0) + 1,
    });
  }

  async submitProgress() {
    this.progress.done = this.validate();
    if (!this.progress.done) {
      this.snackBar.open('Your code does not validate.', '', {duration: 3000});
    }

    if (!this.progress._id) {
      this.progress.unit = this.codeKata._id;
      this.progress.user = this.userService.user._id;
      try {
        const item = await this.progressService.createItem(this.progress);
        this.snackBar.open('Progress has been saved', '', {duration: 3000});
        this.progress._id = item._id;
      } catch (err) {
        this.snackBar.open(`An error occurred: ${err.json().message}`, '', {duration: 3000});
      }
    } else {
      try {
        await this.progressService.updateItem(this.progress);
        this.snackBar.open('Progress has been updated', '', {duration: 3000});
      } catch (err) {
        this.snackBar.open(`An error occurred: ${err.json().message}`, '', {duration: 3000})
      }
    }
  }

  private loadProgress() {
    this.progressService.getUserProgress(this.userService.user._id)
      .then((progress: any) => {
        for (const prop in progress) {
          if (progress[prop].unit === this.codeKata._id) {
            this.progress = progress[prop];
            break;
          }
        }
      });
  }

  onUserInput() {
    this.setOptions();
  }

  // refactor this to use the same as in code-kata-unit-form
  validate() {
    const codeToTest: string = this.codeKata.definition + '\n' + this.progress.code + '\n' + this.codeKata.test;

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
      console.log(msg);
      console.error(err);
    }

    window.console.log = origLogger;

    if (result === true || result === undefined) {
      this.snackBar.open('Success', '', {duration: 3000});
      return true;
    } else {
      this.snackBar.open('Your code failed.', '', {duration: 3000});
      console.log(result);
      return false;
    }
  }
}
