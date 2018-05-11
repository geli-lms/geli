import {ApplicationRef, EventEmitter, Injectable} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FreeTextUnitService, NotificationService, UnitService} from './data.service';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UnitFormService {

  public unitForm: FormGroup;

  public model: IUnit;
  public course: ICourse;
  public lecture: ILecture;

  public headline: string;
  public unitDescription:string;
  public infos:[string];


  /**
   * if false is returned, submit will be cancelled
   */
  public beforeSubmit: () => Promise<boolean>;
  public submitDone: EventEmitter<any>;



  constructor(private formBuilder: FormBuilder,
              private freeTextUnitService: FreeTextUnitService,
              private unitService: UnitService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private notificationService: NotificationService,
              private ref: ApplicationRef) {
    this.reset();

  }

  reset() {
    this.unitForm = new FormGroup({});
    this.submitDone = new EventEmitter<any>();
    this.beforeSubmit = undefined;

    this.headline = null;
    this.unitDescription = null;
    this.infos = null;
  }



  async save() {


    if (this.beforeSubmit) {
      const success = await this.beforeSubmit();
      if (!success) {
        return;
      }
    }

    // check if form is valid.
    if (!this.unitForm.valid) {
      const snackErrMessage = `Given input is not valid. Please fill fields correctly.`;
      this.snackBar.open(snackErrMessage, '', {duration: 3000});
      return;
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
      const responseUnit = await promise;

      console.log(responseUnit);

      const snackSuccMessage = `Unit ${this.model.name ? `'${this.model.name}'` : ''} successfully ${isUpdate ? 'updated' : 'created'}`;

      const notifyMessage = `Course '${this.course.name}' has ${isUpdate ? 'a new' : 'an updated'} Unit '${this.model.name}'`;

      this.snackBar.open(snackSuccMessage, '', {duration: 3000});

      this.submitDone.emit(true);

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
