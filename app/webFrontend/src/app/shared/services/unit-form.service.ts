import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {MatDialog} from '@angular/material';
import {FreeTextUnitService, NotificationService, UnitService} from './data.service';
import {SnackBarService} from './snack-bar.service';

@Injectable()
export class UnitFormService {


  //  Holds the unit Form
  public unitForm: FormGroup;

  // Original Model coure lecture. can be read from everyne
  public model: IUnit;
  public course: ICourse;
  public lecture: ILecture;

  // Headline for the type
  public headline: string;

  // Optional unit info
  public unitInfoText: string;

  /**
   * if false is returned, submit will be cancelled
   */
  public beforeSubmit: () => Promise<boolean>;

  constructor(private formBuilder: FormBuilder,
              private freeTextUnitService: FreeTextUnitService,
              private unitService: UnitService,
              private snackbar: SnackBarService,
              public dialog: MatDialog,
              private notificationService: NotificationService) {
    this.reset();
  }

  reset() {
    this.unitForm = new FormGroup({});
    this.beforeSubmit = undefined;

    this.headline = null;
    this.unitInfoText = null;
  }

  async save(onDone: () => void) {

    // call beforeSubmit from Unit
    if (this.beforeSubmit) {
      const success = await this.beforeSubmit();
      if (!success) {
        return;
      }
    }

    // check if form is valid. Uses form validators
    if (!this.unitForm.valid) {
      const snackErrMessage = `Given input is not valid. Please fill fields correctly.`;
      this.snackbar.openShort(snackErrMessage);
      return;
    }

    // patch model with old model fields + new (updated unitForm fields)
    this.model = {
      ...this.model,
      ...this.unitForm.getRawValue()
    };

    const reqObj = {
      lectureId: this.lecture._id,
      model: this.model
    };

    let isUpdate;
    let promise;

    // finally call update / create item
    if (reqObj.model._id) {
      isUpdate = true;
      promise = this.unitService.updateItem(this.model);
    } else {
      isUpdate = false;
      promise = this.unitService.createItem(reqObj);
    }

    try {
      const responseUnit = await promise;

      const snackSuccMessage = `Unit ${this.model.name ? `'${this.model.name}'` : ''} successfully ${isUpdate ? 'updated' : 'created'}`;

      const notifyMessage = `Course '${this.course.name}' has ${isUpdate ? 'a new' : 'an updated'} Unit '${this.model.name}'`;

      this.snackbar.openShort(snackSuccMessage);

      // call callback function
      onDone();
      // create notification
      if (this.model.visible) {
        this.notificationService.createItem(
          {
            changedCourse: this.course,
            changedLecture: this.lecture._id,
            changedUnit: responseUnit,
            text: notifyMessage
          });
      }
    } catch (err) {
      const snackErrMessage = `Couldn't ${isUpdate ? 'update' : 'create'} Unit '${this.model.name ? `'${this.model.name}'` : ''}'`;

      this.snackbar.openShort(snackErrMessage);
    }
  }
}
