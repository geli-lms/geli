import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnitService, NotificationService, UnitService} from '../../../shared/services/data.service';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {ICodeKataUnit} from '../../../../../../../shared/models/units/ICodeKataUnit';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CodeKataUnit} from '../../../models/units/CodeKataUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {AceEditorComponent} from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/github';
import {FormControl, FormGroup} from '@angular/forms';
import {UnitFormService} from '../../../shared/services/unit-form.service';

@Component({
  selector: 'app-code-kata-unit-form',
  templateUrl: './code-kata-unit-form.component.html',
  styleUrls: ['./code-kata-unit-form.component.scss']
})
export class CodeKataUnitFormComponent implements OnInit {
  @Input()
  course: ICourse;

  @Input()
  lectureId: string;

  @Input()
  model: CodeKataUnit;

  @Input()
  onDone: () => void;

  @Input()
  onCancel: () => void;

  @ViewChild('codeEditor')
  editor: AceEditorComponent;

  unitForm: FormGroup;

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
              private snackBar: SnackBarService,
              private notificationService: NotificationService,
              private unitFormService: UnitFormService) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new CodeKataUnit(this.course._id);
      this.model.definition = this.example.definition;
      this.model.code = this.example.code;
      this.model.test = this.example.test;
    }


    this.unitForm = this.unitFormService.unitForm;

    this.unitFormService.headline = 'Code-Kata';

    this.unitFormService.infos = [
      'Separate definition, coding and test areas with "' + this.areaSeperator + '"',
      'Students can only edit the code area.'
    ];


    this.wholeInputCode =
      this.model.definition
      + '\n' + this.areaSeperator + '\n'
      + this.model.code
      + '\n' + this.areaSeperator + '\n'
      + this.model.test;

    this.unitForm.addControl('wholeInputCode', new FormControl(this.wholeInputCode));
    this.unitForm.addControl('definition', new FormControl(this.model.definition));
    this.unitForm.addControl('code', new FormControl(this.model.code));
    this.unitForm.addControl('test', new FormControl( this.model.test));

    this.editor.getEditor().setOptions({maxLines: 9999});


    this.unitFormService.beforeSubmit = async () => {
      const success = this.validateStructure();
      if (!success) {
        return false;
      }

      const inputCodeArray =  this.unitForm.controls.wholeInputCode.value.split('\n' + this.areaSeperator + '\n');

      this.unitForm.patchValue({
        'definition': inputCodeArray[0],
        'code': inputCodeArray[1],
        'test': inputCodeArray[2]
      });

      // tslint:disable-next-line:no-console
      console.log(this.model);
      // tslint:disable-next-line:no-console
      console.log(this.unitFormService.model);
      return true;
    };

    this.unitFormService.submitDone.subscribe(() => {
      this.onDone();
    });
  }

  validate() {
    if (!this.validateStructure()) {
      return false;
    }
    const codeToTest: string = this.unitForm.controls.wholeInputCode.value;

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
      // tslint:disable-next-line:no-console
      console.error(err);
    }

    window.console.log = origLogger;

    if (result === true || result === undefined) {
      return true;
    } else {
      // tslint:disable-next-line:no-console
      console.log(result);
      return false;
    }
  }

  // this code gets unnessessary with the Implementation of Issue #44 (all validation parts should happen on the server)
  private validateStructure(): boolean {
    const separatorCount = (this.unitForm.controls.wholeInputCode.value.match(new RegExp(this.areaSeperator, 'gmi')) || []).length;
    if (separatorCount > 2) {
      this.snackBar.open('There are too many area separators');
      return false;
    }
    if (separatorCount < 2) {
      this.snackBar.open('There must be 2 area separators');
      return false;
    }
    if (!this.unitForm.controls.wholeInputCode.value.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*}', 'gmi'))) {
      this.snackBar.open('The test section must contain a validate function');
      return false;
    }
    if (!this.unitForm.controls.wholeInputCode.value.match(
      new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*return(.|\n|\t)*}', 'gmi'))
    ) {
      this.snackBar.open('The validate function must return something');
      return false;
    }
    if (!this.unitForm.controls.wholeInputCode.value.match(new RegExp('validate\\(\\);', 'gmi'))) {
      this.snackBar.open('The test section must call the validate function');
      return false;
    }

    return true;
  }

}
