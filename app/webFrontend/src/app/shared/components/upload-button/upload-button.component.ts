import {Component, OnInit, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../services/data.service';
import {FileUploader} from 'ng2-file-upload';
// https://stackoverflow.com/questions/45303404/angular-2-cant-bind-to-uploader-since-it-isnt-a-known-property-of-input
// import {FileSelectDirective} from "ng2-file-upload";

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadButtonComponent implements OnInit {
  uploader: FileUploader = null;
  id: string;
  course: string;
  description: string;
  accessKey: string;
  active = false;
  mode = false;
  enrollType: string;
  newCourse: FormGroup;
  courseOb: any[];

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              public snackBar: MatSnackBar,
              private ref: ChangeDetectorRef,
              public formsModule: FormsModule) {
    // https://stackoverflow.com/questions/38892771/cant-bind-to-ngmodel-since-it-isnt-a-known-property-of-input#38894463

    this.route.params.subscribe(params => {
      this.id = params['id'];

      this.courseService.readSingleItem(this.id).then(
        (val: any) => {
          this.course = val.name;
          this.description = val.description;
          this.accessKey = val.hasAccessKey ? '****' : '';
          this.active = val.active;
          this.enrollType = val.enrollType;
          if (this.enrollType === 'whitelist') {
            this.mode = true;
          }
          this.courseOb = val;
        }, (error) => {
          console.log(error);
        });
    });
  }

  ngOnInit() {
    this.generateForm();
    this.uploader = new FileUploader({
      url: '/api/courses/' + this.id + '/whitelist',
      headers: [{
        name: 'Authorization',
        value: localStorage.getItem('token'),
      }]
    });
    this.uploader.onProgressItem = () => {
      this.ref.detectChanges();
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
      if (status === 200) {
        const course = JSON.parse(response);
        this.snackBar.open('Item is uploaded there where ' + course.whitelist.length + ' users parsed!', '', {duration: 10000});
        setTimeout(() => {
          this.uploader.clearQueue();
        }, 3000);
      } else {
        const error = JSON.parse(response);
        this.snackBar.open('Upload failed with status ' + status + ' message was: ' + error.message, '', {duration: 20000});
        setTimeout(() => {
          this.uploader.clearQueue();
        }, 6000);
      }
    };
  }
  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      teacher: '',
    });
  }
}
