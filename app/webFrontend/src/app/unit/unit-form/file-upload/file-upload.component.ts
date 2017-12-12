import {Component, OnInit, Input, ChangeDetectorRef, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FileUploader, FileItem} from 'ng2-file-upload';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {UnitService} from '../../../shared/services/data.service';
import {FileUnit} from '../../../models/units/FileUnit';
import {UploadFormComponent} from '../../../shared/components/upload-form/upload-form.component';
import {ShowProgressService} from '../../../shared/services/show-progress.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() model: IFileUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  @ViewChild(UnitGeneralInfoFormComponent)
  public generalInfo: UnitGeneralInfoFormComponent;

  @ViewChild(UploadFormComponent)
  public uploadForm: UploadFormComponent;

  uploader: FileUploader = new FileUploader({
    url: '/api/units/upload/file',
    headers: [{
      name: 'Authorization',
      value: localStorage.getItem('token'),
    }]
  });

  private baseUploadPath = '/api/units';
  uploadPath = this.baseUploadPath;
  uploadMethod = 'POST';
  filesSelected = false;
  first = true;
  error = false;

  additionalUploadData: any;

  constructor(public snackBar: MatSnackBar,
              private unitService: UnitService,
              private showProgress: ShowProgressService,
              private ref: ChangeDetectorRef) {
    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
      this.ref.detectChanges();
    };
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new FileUnit(this.course);
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
    this.uploadPath = this.baseUploadPath + '/' + this.model._id;
    this.uploadMethod = 'PUT';
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
      if (this.filesSelected || (this.model.files.length > 0)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  /*
  ngOnInit() {
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('name', this.generalInfo.form.value.name);
      form.append('description', this.generalInfo.form.value.description);
      form.append('lectureId', this.lecture._id);
      form.append('courseId', this.course._id);
    };

    this.uploader.onCompleteAll = () => {
      if (!this.error) {
        this.snackBar.open('All items uploaded!', '', {duration: 3000});
        this.onDone();
      }
    };
    this.uploader.onCompleteItem = (file, response, status, headers) => {
      const responseObject = JSON.parse(response);
      if (status === 200) {
        this.error = false;
      }
      if (this.first && responseObject._id && status === 200) {
        this.first = false;
        // all subsequent (if any) uploads will be added to this unit
        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
          form.append('name', this.generalInfo.form.value.name);
          form.append('description', this.generalInfo.form.value.description);
          form.append('lectureId', this.lecture._id);
          form.append('courseId', this.course._id);
          form.append('unitId', responseObject._id);
        };
        this.uploader.uploadAll();
      }
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.error = true;
      // reset the error state to try again later
      item.isError = false;
      item.isUploaded = false;
      this.snackBar.open(`${item._file.name} failed to upload`, '', {duration: 1000});
    };
  }

  uploadAll() {
    if (this.model) {
      // add to model currently editing
      this.first = false;
      this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('name', this.generalInfo.form.value.name);
        form.append('description', this.generalInfo.form.value.description);
        form.append('lectureId', this.lecture._id);
        form.append('courseId', this.course._id);
        form.append('unitId', this.model._id);
      };
      this.uploader.uploadAll();
    } else {
      // only upload first file, others are uploaded after the first finished
      // and added to the specific unit returned
      this.uploader.uploadItem(this.uploader.getNotUploadedItems()[0]);
    }
  }

  update() {
    if (this.model) {
      this.model.name = this.generalInfo.form.value.name;
      this.model.description = this.generalInfo.form.value.description;
      this.unitService.updateItem(this.model).then((result) => {
        if (result._id && result._id === this.model._id) {
          this.snackBar.open(`Updated successfully`, '', {duration: 1000});
        } else {
          this.snackBar.open(`Updated failed`, '', {duration: 1000});
        }
      });
    }
  }

  deleteFile(file: any) {
    if (this.model) {
      this.model.files = this.model.files.filter((currFile: any) => currFile !== file);
    }
  }

  hasInvalidFileNames() {
    if (this.model) {
      return this.model.files.some((file) => file.alias === '');
    }
    return false;
  }
  */
}
