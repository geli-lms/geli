import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnit} from '../../../../models/CodeKataUnit';
import {MdSnackBar} from '@angular/material';
import {ProgressService, CodeKataProgressService} from 'app/shared/services/data/progress.service';
import {ICodeKataProgress} from '../../../../../../../../shared/models/ICodeKataProgress';
import {UserService} from '../../../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';

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
    this.loadProgress();
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
    this.progress.done = this.validate();
    if (!this.progress.done) {
      this.snackBar.open('Your code does not validate.', '', {duration: 3000});
    }

    if (!this.progress.user || !this.progress.unit) {
      this.progress.unit = this.codeKata._id;
      this.progress.user = this.userService.user._id;
      this.codeKataProgressService.createItem(this.progress)
        .then(() => this.snackBar.open('Progress has been saved'))
        .catch(() => this.snackBar.open('An unknown error occurred'));
    } else {
      this.codeKataProgressService.updateItem(this.progress)
        .then(() => this.snackBar.open('Progress has been updated'))
        .catch(() => this.snackBar.open('An unknown error occurred'));
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

  // refactor this to use the same as in code-kata-unit-form
  private validate() {
    const codeToTest: string = this.codeKata.definition + '\n' + this.progress.code + '\n' + this.codeKata.test;

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
    } else {
      console.log(result);
      return false;
    }
  }
}
