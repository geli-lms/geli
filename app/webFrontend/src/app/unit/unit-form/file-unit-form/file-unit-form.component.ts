import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {UnitService} from '../../../shared/services/data.service';
import {FileUnit} from '../../../models/units/FileUnit';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {VideoUnit} from '../../../models/units/VideoUnit';
import {PickMediaDialog} from '../../../shared/components/pick-media-dialog/pick-media-dialog.component';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';

@Component({
  selector: 'app-file-unit-form',
  templateUrl: './file-unit-form.component.html',
  styleUrls: ['./file-unit-form.component.scss']
})
export class FileUnitFormComponent implements OnInit {

  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() model: IFileUnit;
  @Input() fileUnitType: string;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  @ViewChild(UnitGeneralInfoFormComponent)
  public generalInfo: UnitGeneralInfoFormComponent;

  constructor(public snackBar: MatSnackBar,
              private unitService: UnitService,
              private showProgress: ShowProgressService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    if (!this.model) {
      switch (this.fileUnitType) {
        case 'video': {
          this.model = new VideoUnit(this.course);
          break;
        }
        case 'file': {
          this.model = new FileUnit(this.course);
          break;
        }
        default: {
          this.model = new FileUnit(this.course);
          break;
        }
      }
    }
  }

  save() {
    const reqObj = {
      lectureId: this.lecture._id,
      model: this.model
    };

    const promise = (reqObj.model._id)
      ? this.unitService.updateItem(reqObj)
      : this.unitService.createItem(reqObj);

    promise
      .then((updatedUnit) => {
        this.model = <FileUnit><any> updatedUnit;
        this.onDone();
      })
      .catch((error) => {
        this.snackBar.open('An error occurred', 'Dismiss');
      });
  }

  removeFile(file: any) {
    if (this.model) {
      this.model.files = this.model.files.filter((currFile: any) => currFile !== file);
    }
  }

  checkSave() {
    if (this.generalInfo.form.value.name) {
      return !(this.model.files.length > 0);
    } else {
      return true;
    }
  }

  async openAddFilesDialog() {
    const res = await this.dialog.open(PickMediaDialog, {
      data: {
        directoryId: this.course.media._id,
      },
    });

    res.afterClosed().subscribe(async value => {
      if (value) {
        value.forEach((val: IFile) => {
          // Check if file already added
          let alreadyExists = false;
          this.model.files.forEach(v => {
            if (val._id === v._id) {
              alreadyExists = true;
            }
          });

          // Add file
          if (!alreadyExists) {
            this.model.files.push(val);
          }
        });
        this.snackBar.open('Added files to unit', '', {duration: 2000});
      }
    });
  }
}
