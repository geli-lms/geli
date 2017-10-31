import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IFreeTextUnit} from '../../../../../../../shared/models/units/IFreeTextUnit';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FreeTextUnitService} from '../../../shared/services/data.service';
import {FreeTextUnit} from '../../../models/FreeTextUnit';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {FreeTextUnitEditorComponent} from './free-text-unit-editor/free-text-unit-editor.component';
import {FreeTextUnitEditorDialog} from './free-text-unit-editor/free-text-unit-editor-dialog/free-text-unit-editor.dialog';

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
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
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

    console.log(this.model.markdown);

    // If markdown was left empty, define field for db-consistency
    if (typeof this.model.markdown === 'undefined') {
      this.model.markdown = '';
    }

    // Checks if we have to create a new unit or update an existing
    if (this.isModelNewObj()) {
      // Create new one
      this.freeTextUnitService.createItem({model: this.model, lectureId: this.lectureId})
        .then(
          () => {
            this.snackBar.open('Free text unit saved', '', {duration: 3000});
            this.onDone();
          },
          error => console.log(error)
        );
    } else {
      // Update existing
      delete this.model._course;
      this.freeTextUnitService.updateItem(this.model)
        .then(
          () => {
            this.snackBar.open('Free text unit saved', 'Update', {duration: 2000});
            this.onDone();
          },
          error => console.log(error)
        );
    }
  }

  openFullscreen(): void {
    // TODO: Max-Width/-Height comes with later Material version
    // maxWidth: '100vw',
    // maxHeight: '100vh',
    const dialogRef = this.dialog.open(FreeTextUnitEditorDialog, {
      width: '94vw',
      height: '94vh',
      data: {
        markdown: this.freeTextEditor.markdown ? this.freeTextEditor.markdown : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.model.markdown = result;
    });
  }

  private isModelNewObj(): boolean {
    return typeof this.model._id === 'undefined';
  }
}
