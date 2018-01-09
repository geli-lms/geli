import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {UnitService} from '../../../shared/services/data.service';
import {FileUnit} from '../../../models/units/FileUnit';
import {UploadFormComponent} from '../../../shared/components/upload-form/upload-form.component';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {VideoUnit} from '../../../models/units/VideoUnit';

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

  @ViewChild(UploadFormComponent)
  public uploadForm: UploadFormComponent;

  private baseUploadPath = '/api/units';
  uploadPath = this.baseUploadPath;
  uploadMethod = 'POST';
  filesSelected = false;

  additionalUploadData: any;

  constructor(public snackBar: MatSnackBar,
              private unitService: UnitService,
              private showProgress: ShowProgressService) {  }

  ngOnInit() {
    if (!this.model) {
      switch (this.fileUnitType) {
        case 'video': {
          this.model = new VideoUnit(this.course);
          this.uploadForm.allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'];
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

    this.additionalUploadData = {
      lectureId: this.lecture._id,
      model: this.model
    };

    if (this.model._id) {
      this.uploadMethod = 'PUT';
      this.uploadPath += '/' + this.model._id;
    }
  }

  onFileSelectedChange(event: boolean) {
    this.filesSelected = event;
  }

  onFileUploaded(event: IFileUnit) {
    this.model = event;
    this.additionalUploadData.model = this.model;
    const updatedUploadPath = this.baseUploadPath + '/' + this.model._id;
    if (this.uploadPath === updatedUploadPath && this.uploadMethod === 'PUT') {
      this.uploadForm.uploadNextItem();
    } else {
      this.uploadMethod = 'PUT';
      this.uploadPath = updatedUploadPath;
    }
  }

  onAllUploaded() {
    this.onDone();
  }

  async uploadAll() {
    this.additionalUploadData.model = {
      ...this.model,
      name: this.generalInfo.form.value.name,
      description: this.generalInfo.form.value.description,
    };

    if (this.uploadForm.fileUploader.queue.length > 0) {
      this.uploadForm.uploadNextItem();
    } else {
      this.showProgress.toggleLoadingGlobal(true);
      this.unitService.updateItem(this.model)
        .then((updatedUnit) => {
          this.model = updatedUnit;
          this.onAllUploaded();
        })
        .catch((error) => {
          this.snackBar.open('An error occurred', 'Dismiss');
          this.showProgress.toggleLoadingGlobal(false);
        });
    }
  }

  removeFile(file: any) {
    if (this.model) {
      this.model.files = this.model.files.filter((currFile: any) => currFile !== file);
    }
  }

  checkSave() {
    if (this.generalInfo.form.value.name) {
      return !(this.filesSelected || (this.model.files.length > 0));
    } else {
      return true;
    }
  }
}
