import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnitService, NotificationService, UnitService} from '../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ICodeKataUnit} from '../../../../../../../shared/models/units/ICodeKataUnit';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CodeKataUnit} from '../../../models/units/CodeKataUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {AceEditorComponent} from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';

@Component({
  selector: 'app-code-kata-unit-form',
  templateUrl: './code-kata-unit-form.component.html',
  styleUrls: ['./code-kata-unit-form.component.scss']
})
export class CodeKataUnitFormComponent implements OnInit {
  @Input() course: ICourse;
  @Input() lectureId: string;
  @Input() model: ICodeKataUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  @ViewChild(UnitGeneralInfoFormComponent)
  private generalInfo: UnitGeneralInfoFormComponent;

  @ViewChild('codeEditor')
  editor: AceEditorComponent;

  areaSeperator = '//####################';

  // Example code Kata
  example = {
    definition: '// Task: Manipulate the targetSet, so it only contains the values "Hello" and "CodeKata"' +
    '\n' +
    '\nlet targetSet = new Set(["Hello", "there"]);',
    code: '// This is your code to validate this section. Only course Teachers and Admins can see this' +
    '\ntargetSet.add("CodeKata");' +
    '\ntargetSet.delete("there");',
    test: '// This is the Test Section use the validate function to test the students code' +
    '\nvalidate();' +
    '\n' +
    '\nfunction validate() {' +
    '\n\tconst result = targetSet.has("Hello") && targetSet.has("CodeKata") && targetSet.size === 2;' +
    '\n\tif (result === true) {' +
    '\n\t\tconsole.log("Well done, you solved this Kata");' +
    '\n\t} else {' +
    '\n\t\tconsole.log("Sorry mate, you need to try harder");' +
    '\n\t}' +
    '\n\treturn result;' +
    '\n}'
  };

  logs: string;
  wholeInputCode: string;

  constructor(private codeKataUnitService: CodeKataUnitService,
              private unitService: UnitService,
              private snackBar: MatSnackBar,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new CodeKataUnit(this.course._id);
      this.model.definition = this.example.definition;
      this.model.code = this.example.code;
      this.model.test = this.example.test;
    }

    this.wholeInputCode =
      this.model.definition
      + '\n' + this.areaSeperator + '\n'
      + this.model.code
      + '\n' + this.areaSeperator + '\n'
      + this.model.test;
    this.editor.getEditor().setOptions({
      maxLines: 9999,
    });
  }

  addUnit() {
    if (!this.validate()) {
      this.snackBar.open('Your code does not validate. Check logs for information', '', {duration: 3000});
    }

    const inputCodeArray = this.wholeInputCode.split('\n' + this.areaSeperator + '\n');
    this.model = {
      ...this.model,
      definition: inputCodeArray[0],
      code: inputCodeArray[1],
      test: inputCodeArray[2],
      name: this.generalInfo.form.value.name,
      description: this.generalInfo.form.value.description,
      deadline: this.generalInfo.form.value.deadline,
    };

    if (this.model._id === undefined) {
      this.unitService.createItem({
        model: this.model,
        lectureId: this.lectureId
      })
        .then(
          (unit) => {
            this.snackBar.open('Code-Kata created', '', {duration: 3000});
            this.onDone();
            return this.notificationService.createItem(
              {
                changedCourse: this.course,
                changedLecture: this.lectureId,
                changedUnit: unit,
                text: 'Course ' + this.course.name + ' has a new code kata unit.'
              });
          },
          (error) => {
            const message = error.json().message;
            this.snackBar.open('Failed to create Code-Kata => ' + message, '', {duration: 3000});
          });
    } else {
      delete this.model._course;
      this.unitService.updateItem(this.model)
        .then(
          (unit) => {
            this.snackBar.open('Code-Kata updated', '', {duration: 3000});
            this.onDone();
            return this.notificationService.createItem(
              {
                changedCourse: this.course,
                changedLecture: this.lectureId,
                changedUnit: unit,
                text: 'Course ' + this.course.name + ' has an updated unit.'
              });
          },
          (error) => {
            const message = error.json().message;
            this.snackBar.open('Failed to update Code-Kata => ' + message, '', {duration: 3000});
          });
    }
  }

// refactor this to use the same as in code-kata-unit
  validate() {
    if (!this.validateStructure()) {
      return false;
    }
    const codeToTest: string = this.wholeInputCode;

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

  // this code gets unnessessary with the Implementation of Issue #44 (all validation parts should happen on the server)
  private validateStructure(): boolean {
    const separatorCount = (this.wholeInputCode.match(new RegExp(this.areaSeperator, 'gmi')) || []).length;
    if (separatorCount > 2) {
      this.snackBar.open('There are too many area separators', 'Dismiss');
      return false;
    }
    if (separatorCount < 2) {
      this.snackBar.open('There must be 2 area separators', 'Dismiss');
      return false;
    }
    if (!this.wholeInputCode.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*}', 'gmi'))) {
      this.snackBar.open('The test section must contain a validate function', 'Dismiss');
      return false;
    }
    if (!this.wholeInputCode.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*return(.|\n|\t)*}', 'gmi'))) {
      this.snackBar.open('The validate function must return something', 'Dismiss');
      return false;
    }
    if (!this.wholeInputCode.match(new RegExp('validate\\(\\);', 'gmi'))) {
      this.snackBar.open('The test section must call the validate function', 'Dismiss');
      return false;
    }

    return true;
  }

}
