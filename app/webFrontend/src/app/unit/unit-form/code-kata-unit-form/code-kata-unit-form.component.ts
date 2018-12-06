import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CodeKataUnitService, NotificationService, UnitService} from '../../../shared/services/data.service';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {CodeKataUnit} from '../../../models/units/CodeKataUnit';
import {AceEditorComponent} from 'ng2-ace-editor';
import 'brace/theme/github';
import 'brace/mode/javascript';
import {FormControl, FormGroup} from '@angular/forms';
import {UnitFormService} from '../../../shared/services/unit-form.service';
import {CodeKataValidationService} from '../../../shared/services/code-kata-validation.service';

@Component({
  selector: 'app-code-kata-unit-form',
  templateUrl: './code-kata-unit-form.component.html',
  styleUrls: ['./code-kata-unit-form.component.scss']
})
export class CodeKataUnitFormComponent implements OnInit {
  private model: CodeKataUnit;

  @ViewChild('codeEditor')
  editor: AceEditorComponent;

  // holds unitform
  unitForm: FormGroup;

  // to seperate definition, code and test
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
              private unitFormService: UnitFormService,
              private codeKataValidationService: CodeKataValidationService) {
  }

  ngOnInit() {

    // sets model. for easier handling (you also could use model from unitFormService
    this.model = <CodeKataUnit> this.unitFormService.model;

    // set example Values if all values are undefined
    if (!this.model.definition && !this.model.code && !this.model.test) {
      this.model.definition = this.example.definition;
      this.model.code = this.example.code;
      this.model.test = this.example.test;
    }
    // set empty string if single value is undefined
    this.model.definition = this.model.definition ? this.model.definition : '';
    this.model.code = this.model.code ? this.model.code : '';
    this.model.test = this.model.test ? this.model.test : '';

    this.unitForm = this.unitFormService.unitForm;

    this.unitFormService.headline = 'Code-Kata';

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

    // this.editor.getEditor().setOptions({maxLines: 9999});


    this.unitFormService.beforeSubmit = async () => {
      const success = this.validate();
      if (!success) {
        return false;
      }

      const inputCodeArray =  this.unitForm.controls.wholeInputCode.value.split('\n' + this.areaSeperator + '\n');

      this.unitForm.patchValue({
        'definition': inputCodeArray[0],
        'code': inputCodeArray[1],
        'test': inputCodeArray[2]
      });
      return true;
    };
  }

  validate() {
    if (!this.validateStructure()) {
      return false;
    }
    const codeToTest: string = this.unitForm.controls.wholeInputCode.value;

    this.logs = undefined;

    const validation = this.codeKataValidationService.validate(codeToTest);
    this.logs = validation.log;


    if (validation.result === true || validation.result === undefined) {
      this.snackBar.openShort('Validation succesful');
      return true;
    } else {
      this.snackBar.openShort('Validation failed');
      return false;
    }
  }

  // this code gets unnessessary with the Implementation of Issue #44 (all validation parts should happen on the server)
  private validateStructure(): boolean {
    const separatorCount = (
      this.unitForm.controls.wholeInputCode.value.match(
        new RegExp('\n' + this.areaSeperator + '\n', 'gmi')
      ) || []
    ).length;
    if (separatorCount > 2) {
      this.snackBar.openShort('There are too many area separators');
      return false;
    }
    if (separatorCount < 2) {
      this.snackBar.openShort('There must 3 separated areas');
      return false;
    }
    if (!this.unitForm.controls.wholeInputCode.value.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*}', 'gmi'))) {
      this.snackBar.openShort('The test section must contain a validate function');
      return false;
    }
    if (!this.unitForm.controls.wholeInputCode.value.match(
      new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*return(.|\n|\t)*}', 'gmi'))
    ) {
      this.snackBar.openShort('The validate function must return something');
      return false;
    }
    if (!this.unitForm.controls.wholeInputCode.value.match(new RegExp('validate\\(\\);', 'gmi'))) {
      this.snackBar.openShort('The test section must call the validate function');
      return false;
    }

    return true;
  }
}
