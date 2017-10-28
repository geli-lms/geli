import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnit} from '../../models/CodeKataUnit';
import {MdSnackBar} from '@angular/material';
import {ProgressService, CodeKataProgressService} from 'app/shared/services/data/progress.service';
import {ICodeKataProgress} from '../../../../../../shared/models/ICodeKataProgress';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';

// import '../../../../../../../node_modules/ace-builds/src-min/ace.js';

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
  progress: ICodeKataProgress;
  isExampleCode = false;

  constructor(private route: ActivatedRoute,
              private snackBar: MdSnackBar,
              private progressService: ProgressService,
              private codeKataProgressService: CodeKataProgressService,
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
      maxLines: Infinity,
    });
    this.codeEditor.setOptions({
      maxLines: Infinity,
      firstLineNumber: this.codeKata.definition.split('\n').length || 1,
    });
    this.testEditor.setOptions({
      maxLines: Infinity,
      firstLineNumber: (this.codeKata.definition.split('\n').length + this.progress.code.split('\n').length) || 1,
    });
  }

  submitProgress() {
    this.progress.done = this.validate();
    if (!this.progress.done) {
      this.snackBar.open('Your code does not validate.', '', {duration: 3000});
    }

    if (!this.progress.user || !this.progress.unit) {
      this.progress.unit = this.codeKata._id;
      this.progress.user = this.userService.user._id;
      this.codeKataProgressService.createItem(this.progress)
        .then(() => this.snackBar.open('Progress has been saved', '', {duration: 3000}))
        .catch(() => this.snackBar.open('An unknown error occurred', '', {duration: 3000}));
    } else {
      this.codeKataProgressService.updateItem(this.progress)
        .then(() => this.snackBar.open('Progress has been updated', '', {duration: 3000}))
        .catch(() => this.snackBar.open('An unknown error occurred', '', {duration: 3000}));
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
