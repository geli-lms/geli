import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CourseService} from '../../shared/services/data.service';
import {MdSnackBar} from '@angular/material';
import {ShowProgressService} from '../../shared/services/show-progress.service';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  course: string;
  description: string;
  newCourse: FormGroup;
  id: string;

  courseOb: any[];



  message = 'Course successfully added.';

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              public snackBar: MdSnackBar,
              public viewContainerRef: ViewContainerRef,
              private showProgress: ShowProgressService) {

      this.route.params.subscribe(params => {
          this.id = params['id'];

          this.courseService.readSingleItem(this.id).then(
              (val: any) => {
                  this.course = val.name;
                  this.description = val.description;
                  this.courseOb = val;
              }, (error) => {
                  console.log(error);
              });
      });
  }

  ngOnInit() {
    this.generateForm();
  }

  createCourse() {
    this.showProgress.toggleLoadingGlobal(true);
    console.log(this.description);
    console.log(this.course);

    this.courseService.updateItem({'name': this.course, 'description': this.description, '_id': this.id}).then(
        (val) => {
            console.log(val);
            this.showProgress.toggleLoadingGlobal(false);
        }, (error) => {
            this.showProgress.toggleLoadingGlobal(false);
            console.log(error);
        });
  }

  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      teacher: '',
    });
  }
}
