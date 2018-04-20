import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {errorCodes} from '../../../../../../api/src/config/errorCodes';
import {TitleService} from '../../shared/services/title.service';

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
              public snackBar: MatSnackBar,
              private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitle('New Course');
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
        this.router.navigate(['course', val._id, 'edit']);
      }, (err) => {
        if (err.error.message === errorCodes.course.duplicateName.code) {
          this.nameError = errorCodes.course.duplicateName.text;
        } else {
          this.snackBar.open('Error creating course ' + err.error.message, 'Dismiss');
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
