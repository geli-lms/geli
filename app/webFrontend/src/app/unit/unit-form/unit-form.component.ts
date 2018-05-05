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

  @ViewChild(FreeTextUnitFormComponent)
  private freeTextUnitFormComponent: FreeTextUnitFormComponent;

  @ViewChild(CodeKataComponent)
  private codeKataComponent:CodeKataComponent;

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

    if(this.model._id){

    }
  }

  async save() {
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

    }else{
      isUpdate = false;
      promise = this.unitService.createItem(reqObj);
    }

    try{
      let responseUnit = await promise;

      console.log(responseUnit);

      this.snackBar.open('Free text unit saved', '', {duration: 3000});
      this.onDone();
      this.notificationService.createItem(
        {
          changedCourse: this.course,
          changedLecture: this.lecture._id,
          changedUnit: responseUnit,
          text: 'Course ' + this.course.name + ' has a new text unit.'
        });

    }catch(err){
      this.snackBar.open('Couldn\'t update unit', '', {duration: 3000});
    }



    if (!this.unitForm.valid) {
      // console.log("invalid form")
      return;
    }
    // console.log(this.unitForm.value.markdown);
    }
}
