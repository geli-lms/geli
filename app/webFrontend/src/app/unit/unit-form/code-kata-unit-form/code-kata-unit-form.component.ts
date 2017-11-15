import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnitService} from '../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ICodeKataUnit} from '../../../../../../../shared/models/units/ICodeKataUnit';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CodeKataUnit} from '../../../models/CodeKataUnit';
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
      '\n\tlet result = targetSet.has("Hello") && targetSet.has("CodeKata") && targetSet.size === 2;' +
      '\n\tif (result === true) {' +
      '\n\t\tconsole.log("Well done, you solved this Kata");' +
      '\n\t} else {' +
      '\n\t\tconsole.log("Sorry mate, you need to try harder");' +
      '\n\t}' +
      '\n\treturn result;' +
      '\n}'
  };

  logs: string;

  constructor(private codeKataUnitService: CodeKataUnitService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new CodeKataUnit(this.course._id);
      this.model.code =
        this.example.definition
        + '\n\n' + this.areaSeperator + ' code-section' + ((this.example.code.startsWith('//')) ? '\n' : '\n\n')
        + this.example.code
        + '\n\n' + this.areaSeperator + ' test-section' + ((this.example.test.startsWith('//')) ? '\n' : '\n\n')
        + this.example.test;
      this.model.definition = undefined;
      this.model.test = undefined;
    } else {
      this.model.code =
        this.model.definition
        + '\n\n' + this.areaSeperator + '\n\n'
        + this.model.code
        + '\n\n' + this.areaSeperator + '\n\n'
        + this.model.test;
      this.model.definition = undefined;
      this.model.test = undefined;
    }

    this.editor.getEditor().setOptions({
      maxLines: 9999,
    });
  }

  addUnit() {
    if (!this.validate()) {
      this.snackBar.open('Your code does not validate. Check logs for information', '', {duration: 3000});
    }

    this.model = {
      ...this.model,
      name: this.generalInfo.form.value.name,
      description: this.generalInfo.form.value.description,
    };

    if (this.model._id === undefined) {
      this.codeKataUnitService.createItem({
        model: this.model,
        lectureId: this.lectureId,
      })
      .then(
        () => {
          this.snackBar.open('Code-Kata created', '', {duration: 3000});
          this.onDone();
        },
        (error) => {
          const message = error.json().message;
          this.snackBar.open('Failed to create Code-Kata => ' + message, '', {duration: 3000});
        });
    } else {
      delete this.model._course;
      this.codeKataUnitService.updateItem(this.model)
      .then(
        () => {
          this.snackBar.open('Code-Kata updated', '', {duration: 3000});
          this.onDone();
        },
        (error) => {
          const message = error.json().message;
          this.snackBar.open('Failed to update Code-Kata => ' + message, '', {duration: 3000});
        });
    }
  }

// refactor this to use the same as in code-kata-unit
  validate() {
    const codeToTest: string = this.model.code;

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
