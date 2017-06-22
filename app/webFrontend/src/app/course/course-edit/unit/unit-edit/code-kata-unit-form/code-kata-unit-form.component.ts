import {Component, Input, NgModule, OnInit, ViewChild} from '@angular/core';
import {UnitService} from '../../../../../shared/services/data.service';
import {MdSnackBar} from '@angular/material';
import {ICodeKataUnit} from '../../../../../../../../../shared/models/units/ICodeKataUnit';
import {ICourse} from '../../../../../../../../../shared/models/ICourse';
import {CodeKataUnit} from '../../../../../models/CodeKataUnit';
import {UnitGeneralInfoFormComponent} from "../unit-general-info-form/unit-general-info-form.component";

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

  logs: string;

  constructor(private unitService: UnitService,
              private snackBar: MdSnackBar) { }

  ngOnInit() {
    if (!this.model) {
      this.model = new CodeKataUnit(this.course._id);
    }
  }

  private addUnit() {
    if (this.validate()) {
      this.unitService.addCodeKataUnit({
        name: this.generalInfo.form.value.name,
        description: this.generalInfo.form.value.description,
        ...this.model
      }, this.lectureId)
        .then(
          (task) => {
            this.snackBar.open('Code-Kata created', '', { duration: 3000});
            this.onDone();
          },
          (error) => {
            console.log(error);
          });
    } else {
      this.snackBar.open('Your code does not validate. Check logs for information', '', { duration: 3000});
    }
  }

  // refactor this to use the same as in code-kata-unit
  private validate() {
    const codeToTest: string = this.model.code;

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

    window.onerror = function(message, url, linenumber) {
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
    }
    else {
      console.log(result);
      return false;
    }
  }

}
