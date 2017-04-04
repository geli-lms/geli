import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseService} from "../../shared/data.service";
import {MdSnackBar} from "@angular/material";
import {Router} from "@angular/router";

@Component({
  selector: 'app-course-new',
  templateUrl: './course-new.component.html',
  styleUrls: ['./course-new.component.scss']
})
export class CourseNewComponent implements OnInit {
    newCourse: FormGroup;
    teacher: String;

    id: string;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private courseService: CourseService,
                public snackBar: MdSnackBar,
                public viewContainerRef: ViewContainerRef) { }

    ngOnInit() {
        this.generateForm();
    }

    createCourse() {
        this.newCourse.patchValue({
            teacher: this.teacher
        });
        console.log(this.newCourse.value);
        this.courseService.createItem(this.newCourse.value).then(
            (val) => {
                var url = '/course/edit/' + val._id;
                console.log(url);
                this.router.navigate([url]);
            }, (error) => {
                console.log(error);
            });
    }

    generateForm() {
        this.newCourse = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            teacher: ''
        });
    }

}
