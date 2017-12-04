import {Component, OnInit, Input, ChangeDetectorRef, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FileUploader, FileItem} from 'ng2-file-upload';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {IVideoUnit} from '../../../../../../shared/models/units/IVideoUnit';
/* tslint:disable-next-line:max-line-length */
import {UnitGeneralInfoFormComponent} from '../../unit/unit-form/unit-general-info-form/unit-general-info-form.component';
import {UnitService} from '../../shared/services/data.service';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {

  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() model: IVideoUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  @ViewChild(UnitGeneralInfoFormComponent)
  public generalInfo: UnitGeneralInfoFormComponent;

  allowedMimeType: string[] = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'];
  uploader: FileUploader = new FileUploader({
    url: '/api/units',
    headers: [{
      name: 'Authorization',
      value: localStorage.getItem('token'),
    }],
    allowedMimeType: this.allowedMimeType
  });
  first = true;
  error = false;

  constructor(public snackBar: MatSnackBar,
              private unitService: UnitService,
              private ref: ChangeDetectorRef) {
    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
      this.ref.detectChanges();
    };
  }

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
}
