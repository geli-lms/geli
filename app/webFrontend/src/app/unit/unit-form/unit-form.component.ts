import {Component, OnInit, Input, ViewChild, EventEmitter} from '@angular/core';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FreeTextUnitFormComponent} from "./free-text-unit-form/free-text-unit-form.component";
import {CodeKataComponent} from "../code-kata-unit/code-kata-unit.component";
import {MatDialog, MatSnackBar} from "@angular/material";
import {FreeTextUnitService, NotificationService, UnitService} from "../../shared/services/data.service";
import {FileUnit} from "../../models/units/FileUnit";
import {TaskUnitEditComponent} from "./task-unit-edit/task-unit-edit.component";
import {Subject} from "rxjs/Subject";
import {UnitFormService} from "../../shared/services/unit-form.service";

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.scss']
})
export class UnitFormComponent implements OnInit {

  @Input() model: IUnit;
  @Input() type: string;
  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  // add all child-components here for extra Buttons etc. (see other unit types, eg. full-text)
  @ViewChild(FreeTextUnitFormComponent)
  private freeTextUnitFormComponent: FreeTextUnitFormComponent;

  @ViewChild(CodeKataComponent)
  private codeKataComponent: CodeKataComponent;

  @ViewChild(TaskUnitEditComponent)
  private taskUnitEditComponent:TaskUnitEditComponent;


  unitForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private freeTextUnitService: FreeTextUnitService,
              private unitService: UnitService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private notificationService: NotificationService,
              private unitFormService: UnitFormService) {
  }

  ngOnInit() {
    this.unitFormService.model = this.model;
    this.unitFormService.course = this.course;
    this.unitFormService.lecture = this.lecture;

    this.unitForm = this.unitFormService.unitForm;

    this.unitFormService.submitDone.subscribe(() => this.onDone());

  }


  reset(){
   this.unitFormService.reset();
   this.onCancel();
  }

  async save(){
    return this.unitFormService.save();
  }
}
