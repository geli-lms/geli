import {Component, OnInit, Input, ViewChild} from '@angular/core';
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
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.unitForm = new FormGroup({});

  }

  async save() {
    // check if form is valid.
    if (!this.unitForm.valid) {
      const snackErrMessage = `Given input is not valid. Please fill fields correctly.`;
      this.snackBar.open(snackErrMessage, '', {duration: 3000});

      return
    }


    this.model = {
      ...this.model,
      ...this.unitForm.getRawValue()
    };

    console.log(this.model);

    const reqObj = {
      lectureId: this.lecture._id,
      model: this.model
    };

    let isUpdate;
    let promise;

    if (reqObj.model._id) {
      isUpdate = true;
      promise = this.unitService.updateItem(this.model);

    } else {
      isUpdate = false;
      promise = this.unitService.createItem(reqObj);
    }

    try {
      let responseUnit = await promise;

      console.log(responseUnit);

      const snackSuccMessage = `Unit ${this.model.name ? `'${this.model.name}'` : ''} successfully ${isUpdate ? 'updated' : 'created'}`;

      const notifyMessage = `Course '${this.course.name}' has ${isUpdate ? 'a new' : 'an updated'} Unit '${this.model.name}'`;

      this.snackBar.open(snackSuccMessage, '', {duration: 3000});
      this.onDone();
      this.notificationService.createItem(
        {
          changedCourse: this.course,
          changedLecture: this.lecture._id,
          changedUnit: responseUnit,
          text: notifyMessage
        });

    } catch (err) {
      const snackErrMessage = `Couldn't ${isUpdate ? 'update' : 'create'} Unit '${this.model.name ? `'${this.model.name}'` : ''}'`;

      this.snackBar.open(snackErrMessage, '', {duration: 3000});
    }

  }
}
