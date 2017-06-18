import {Component, OnInit, ViewContainerRef, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CourseService} from '../../shared/services/data.service';
import {MdSnackBar} from '@angular/material';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {FileUploader, FileItem} from 'ng2-file-upload';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  course: string;
  description: string;
  accessKey: string;
  active = false;
  mode = false;
  enrollType: string;
  newCourse: FormGroup;
  id: string;
  courseOb: any[];
  uploader: FileUploader = null;


  message = 'Course successfully added.';

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              public snackBar: MdSnackBar,
              public viewContainerRef: ViewContainerRef,
              private ref: ChangeDetectorRef,
              private showProgress: ShowProgressService) {

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
      allowedMimeType: ['application/vnd.ms-excel'],
      url: '/api/courses/' + this.id + '/whitelist',
      headers: [{
        name: 'Authorization',
        value: localStorage.getItem('token'),
      }]
    });
    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
      this.ref.detectChanges();
    };
    this.uploader.onCompleteAll = () => {
      this.snackBar.open('All items uploaded!', '', { duration: 3000 });
      setTimeout(() => {
        this.uploader.clearQueue();
      }, 3000);
    };
  }

  createCourse() {
    this.showProgress.toggleLoadingGlobal(true);
    console.log(this.description);
    console.log(this.course);

    const request: any = {'name': this.course, 'description': this.description, '_id': this.id, 'active': this.active, 'enrollType': this.enrollType};
    if (this.accessKey !== '****') {
      request.accessKey = this.accessKey;
    }
    this.courseService.updateItem(request).then(
        (val) => {
            console.log(val);
            this.showProgress.toggleLoadingGlobal(false);
        }, (error) => {
            this.showProgress.toggleLoadingGlobal(false);
            console.log(error);
        });
  }

  onChangeMode(value) {
    if (value.checked === true) {
      this.mode = true;
      this.enrollType = 'whitelist';
    } else {
      this.mode = false;
      this.enrollType = 'free';
    }
  }

  onChangeActive(value) {
    if (value.checked === true) {
      this.active = true;
    } else {
      this.active = false;
    }
  }



  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      teacher: '',
    });
  }
}
