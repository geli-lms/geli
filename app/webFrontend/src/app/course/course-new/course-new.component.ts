import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-course-new',
  templateUrl: './course-new.component.html',
  styleUrls: ['./course-new.component.scss']
})
export class CourseNewComponent implements OnInit {
  newCourse: FormGroup;
  id: string;
  nameError: string;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.generateForm();
  }

  resetErrors() {
    this.nameError = null;
  }

  createCourse() {
    this.resetErrors();
    this.courseService.createItem(this.newCourse.value).then(
      (val) => {
        this.snackBar.open('Course created', 'Dismiss', {duration: 5000});
        const url = '/course/' + val._id + '/edit';
        void this.router.navigate([url]);
      }, (error) => {
        // Mongodb uses the error field errmsg
        const errormessage = error.json().message || error.json().errmsg;
        if (errormessage === 'duplicate course name') {
          this.nameError = 'Course name already in use.';
        } else {
          this.snackBar.open('Error creating course ' + errormessage, 'Dismiss');
        }
      });
  }

  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

}
