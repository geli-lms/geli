import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {NotificationService, UnitService} from '../../../shared/services/data.service';
import {FileUnit} from '../../../models/units/FileUnit';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {VideoUnit} from '../../../models/units/VideoUnit';
import {PickMediaDialog} from '../../../shared/components/pick-media-dialog/pick-media-dialog.component';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';
import {UnitFormService} from "../../../shared/services/unit-form.service";
import {FormControl, FormGroup} from '@angular/forms';

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
              private dialog: MatDialog,
              private unitFormService: UnitFormService) {
  }

  ngOnInit() {
    //TODO write high level model factory, so that all instances above use the same model-object at the same time.
    if (!this.model) {
      if (this.fileUnitType === 'video') {
        // 'video'
        this.model = new VideoUnit(this.course);
      } else {
        // default or 'file'
        this.model = new FileUnit(this.course);
      }
    }

    this.unitFormService.headline = this.fileUnitType === 'video' ? 'Add Videos' : 'Add Files';

    this.unitFormService.unitForm.addControl('files',new FormControl(this.model.files));
  }

  removeFile(file: any) {
    if (this.model) {
      this.model.files = this.model.files.filter((currFile: any) => currFile !== file);
    }
  }

  async openAddFilesDialog() {
    if (this.course.media === undefined) {
      this.snackBar.open('Please add files first', '', {duration: 3000});
      return;
    }

    const allowedMimeTypes = (this.fileUnitType !== 'video') ? undefined : [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
    ];

    const res = await this.dialog.open(PickMediaDialog, {
      data: {
        directoryId: this.course.media._id,
        allowedMimeTypes: allowedMimeTypes,
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
