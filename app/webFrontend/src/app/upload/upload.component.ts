import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {FileUploader} from 'ng2-file-upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() course;

  lectureId: string;
  uploader: FileUploader = new FileUploader({
    url: '/api/unit',
    headers: [{
      name: 'Authorization',
      value: localStorage.getItem('token'),
    }]
  });

  constructor(private router: Router,
              public snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('lectureId', this.lectureId);
    };
    this.uploader.onCompleteAll = () => {
      this.snackBar.open('All items uploaded!', '', { duration: 3000 });
      setTimeout(() => {
        this.uploader.clearQueue();
      }, 3000);
    };
  }

}
