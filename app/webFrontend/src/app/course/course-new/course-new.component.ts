import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../shared/services/data.service';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {Router} from '@angular/router';
import {errorCodes} from '../../../../../../api/src/config/errorCodes';
import {TitleService} from '../../shared/services/title.service';
import {MatDialogRef} from '@angular/material';

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
              private snackBar: SnackBarService,
              private titleService: TitleService,
              public dialogRef: MatDialogRef<CourseNewComponent>) {
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
    this.courseService.createItem(this.newCourse.value).then(val => {
      this.snackBar.open('Course created');
      this.router.navigate(['course', val._id, 'edit']);
    }).catch(err => {
      if (err.error.message === errorCodes.course.duplicateName.code) {
        this.nameError = errorCodes.course.duplicateName.text;
      } else {
        this.snackBar.open('Error creating course ' + err.error.message);
      }
    });
    this.dialogRef.close();
  }

  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }
}
