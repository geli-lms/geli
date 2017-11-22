import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {FileUploader} from 'ng2-file-upload';
import {ENROLL_TYPES, ENROLL_TYPE_WHITELIST, ENROLL_TYPE_FREE, ENROLL_TYPE_ACCESSKEY} from '../../../../../../shared/models/ICourse';

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
  enrollTypes =  ENROLL_TYPES;


  message = 'Course successfully added.';

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              public snackBar: MatSnackBar,
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

  createCourse() {
    this.showProgress.toggleLoadingGlobal(true);
    console.log(this.description);
    console.log(this.course);

    const request: any = {
      'name': this.course, 'description': this.description, '_id': this.id, 'active': this.active, 'enrollType': this.enrollType
    };
    if (this.accessKey !== '****') {
      request.accessKey = this.accessKey;
    }
    this.courseService.updateItem(request).then(
      (val) => {
        console.log(val);
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open('Saved successfully', '', {duration: 5000});
      }, (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        // Mongodb uses the error field errmsg
        const errormessage = error.json().message || error.json().errmsg;
        this.snackBar.open('Saving course failed ' + errormessage, 'Dismiss');
        console.log(error);
      });
  }


  GetCourseValue() {
    this.mode = true;
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

  selectType(event) {
    console.log(event);
    if (event.value === ENROLL_TYPE_WHITELIST) {
      this.enrollType = event.value;
    }
    if (event.value === ENROLL_TYPE_FREE) {
      this.enrollType = event.value;
    }
    if (event.value === ENROLL_TYPE_ACCESSKEY) {
      this.enrollType = event.value;
    }
  }

  onChangeActive(value) {
    this.active = value.checked;
  }

  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      teacher: '',
    });
  }
}
