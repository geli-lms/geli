import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IFreeTextUnit} from '../../../../../../../shared/models/units/IFreeTextUnit';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FreeTextUnitService, NotificationService, UnitService} from '../../../shared/services/data.service';
import {FreeTextUnit} from '../../../models/units/FreeTextUnit';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {FreeTextUnitEditorComponent} from './free-text-unit-editor/free-text-unit-editor.component';
import {FreeTextUnitEditorDialog} from './free-text-unit-editor/free-text-unit-editor-dialog/free-text-unit-editor.dialog';
import {isUndefined} from 'util';

@Component({
  selector: 'app-free-text-unit-form',
  templateUrl: './free-text-unit-form.component.html',
  styleUrls: ['./free-text-unit-form.component.scss']
})
export class FreeTextUnitFormComponent implements OnInit {
  @Input() course: ICourse;
  @Input() lectureId: string;
  @Input() model: IFreeTextUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  @ViewChild(UnitGeneralInfoFormComponent)
  private generalInfo: UnitGeneralInfoFormComponent;
  @ViewChild(FreeTextUnitEditorComponent)
  private freeTextEditor: FreeTextUnitEditorComponent;

  constructor(private freeTextUnitService: FreeTextUnitService,
              private unitService: UnitService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new FreeTextUnit(this.course._id);
    }
  }

  saveUnit() {
    this.model = {
      ...this.model,
      name: this.generalInfo.form.value.name,
      description: this.generalInfo.form.value.description,
      markdown: this.freeTextEditor.markdown
    };

    // If markdown was left empty, define field for db-consistency
    if (isUndefined(this.model.markdown)) {
      this.model.markdown = '';
    }

    // Checks if we have to create a new unit or update an existing
    if (this.isModelNewObj()) {
      // Create new one
      this.unitService.createItem({model: this.model, lectureId: this.lectureId})
        .then(
          (unit) => {
            this.snackBar.open('Free text unit saved', '', {duration: 3000});
            this.onDone();
            return this.notificationService.createItem(
              {
                changedCourse: this.course,
                changedLecture: this.lectureId,
                changedUnit: unit,
                text: 'Course ' + this.course.name + ' has a new text unit.'
              });
          },
          error => {
            this.snackBar.open('Couldn\'t save unit', '', {duration: 3000});
          }
        );
    } else {
      // Update existing
      // delete this.model._course;
      this.unitService.updateItem(this.model)
        .then(
          (unit) => {
            this.notificationService.createItem(
              {
                changedCourse: this.course, changedLecture: this.lectureId,
                changedUnit: unit, text: 'Course ' + this.course.name + ' has an updated text unit.'
              })
              .catch(console.error);
            this.snackBar.open('Free text unit saved', 'Update', {duration: 2000});
            this.onDone();
          },
          error => {
            this.snackBar.open('Couldn\'t update unit', '', {duration: 3000});
          }
        );
    }
  }

  openFullscreen(): void {
    const dialogRef = this.dialog.open(FreeTextUnitEditorDialog, {
      width: '94vw',
      height: '94vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        markdown: this.freeTextEditor.markdown ? this.freeTextEditor.markdown : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.model.markdown = result;
      }
    });
  }

  private isModelNewObj(): boolean {
    return typeof this.model._id === 'undefined';
  }
}
