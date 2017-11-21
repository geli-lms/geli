import {Component, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {CourseService} from '../../shared/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  allCourses: ICourse[];

  // UserService for HTML page
  constructor(private courseService: CourseService,
              public userService: UserService) {
    this.allCourses = [];
  }

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.courseService.readItems().then(courses => {
      this.allCourses = courses;
      });
  }

  onUpdateCallback() {
      this.getCourses();
  }
}
