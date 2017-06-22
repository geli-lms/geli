import {Component, OnInit, Input, ChangeDetectorRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {FileUploader, FileItem} from 'ng2-file-upload';
import {ICourse} from '../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../shared/models/ILecture';
import {IVideoUnit} from '../../../../../shared/models/units/IVideoUnit';
import {UnitGeneralInfoFormComponent} from '../course/course-edit/unit/unit-edit/unit-general-info-form/unit-general-info-form.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() model: IVideoUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  @ViewChild(UnitGeneralInfoFormComponent)
  private generalInfo: UnitGeneralInfoFormComponent;

  uploader: FileUploader = new FileUploader({
    url: '/api/units/upload',
    headers: [{
      name: 'Authorization',
      value: localStorage.getItem('token'),
    }]
  });

  constructor(public snackBar: MdSnackBar,
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
      this.snackBar.open('All items uploaded!', '', {duration: 3000});
      this.onDone();
      setTimeout(() => {
        this.uploader.clearQueue();
      }, 3000);
    };
  }
}
