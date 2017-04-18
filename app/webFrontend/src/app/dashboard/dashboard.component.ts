import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "../shared/user.service";
import {Course} from "../models/course";
import {CourseService} from "../shared/data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  allCourses: Course[];

  // UserService for HTML page
  constructor(private userService: UserService,
              private courseService: CourseService,
              private router: Router) {
    this.getCourses();
  }

  ngOnInit() {

  }

  getAllCourses(): Course[] {
    return this.allCourses;
  }

  getCourses() {
    this.courseService.readItems().then(courses => {
      this.allCourses = courses;
    });
  }

  editCourse(id: string) {
    let url = '/course/edit/' + id;
    this.router.navigate([url]);
  }

  apply() {
    console.log("apply");
  }

  goToInfo(course: string) {
    let url = '/course/detail/' + course;
    this.router.navigate([url]);
  }

}
