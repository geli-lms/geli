import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SnackBarService} from '../../shared/services/snack-bar.service';
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
import {CodeKataValidationService} from '../../shared/services/code-kata-validation.service';

@Component({
  selector: 'app-code-kata',
  templateUrl: './code-kata-unit.component.html',
  styleUrls: ['./code-kata-unit.component.scss']
})
export class CodeKataComponent implements OnInit {

  @Input()
  codeKataUnit: ICodeKataUnit;

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
              private snackBar: SnackBarService,
              private progressService: ProgressService,
              private userService: UserService,
              private codeKataValidationService: CodeKataValidationService) {
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

    this.applyProgressData();
  }

  async applyProgressData() {
    const progress = await this.progressService.getUnitProgress<ICodeKataUnitProgress>(this.codeKataUnit._id);
    if (progress) {
      this.progress = progress;
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
      this.snackBar.open('Your code does not validate.');
    }

    if (!this.progress._id) {
      this.progress.user = this.userService.user._id;
      this.progressService.createItem(this.progress)
        .then((item) => {
          this.snackBar.open('Progress has been saved');
          this.progress = item;
        })
        .catch((err) => {
          this.snackBar.open(`An error occurred: ${err.error.message}`);
        });
    } else {
      this.progress.code = this.codeKataUnit.code;
      this.progressService.updateItem(this.progress)
        .then((item) => {
          this.snackBar.open('Progress has been updated');
          this.progress = item;
        })
        .catch((err) => {
          this.snackBar.open(`An error occurred: ${err.error.message}`);
        });
    }
  }

  onUserInput() {
    this.setOptions();
  }

  // refactor this to use the same as in code-kata-unit-form
  validate() {
    const codeToTest: string = this.codeKataUnit.definition + '\n' + this.codeKataUnit.code + '\n' + this.codeKataUnit.test;

    this.logs = undefined;

    const validation = this.codeKataValidationService.validate(codeToTest);
    this.logs = validation.log;

    if (validation.result === true || validation.result === undefined) {
      this.snackBar.open('Success');
      return true;
    } else {
      this.snackBar.open('Your code failed.');
      return false;
    }
  }
}
