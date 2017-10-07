import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../shared/services/data.service';
import {MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-course-new',
  templateUrl: './course-new.component.html',
  styleUrls: ['./course-new.component.scss']
})
export class CourseNewComponent implements OnInit {
    newCourse: FormGroup;
    id: string;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private courseService: CourseService,
                public snackBar: MdSnackBar) { }

    ngOnInit() {
        this.generateForm();
    }

    createCourse() {
        this.courseService.createItem(this.newCourse.value).then(
            (val) => {
                const url = '/course/edit/' + val._id;
                this.router.navigate([url]);
            }, (error) => {
                this.snackBar.open('Error creating course', 'Dismiss');
            });
    }

    generateForm() {
        this.newCourse = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

}
