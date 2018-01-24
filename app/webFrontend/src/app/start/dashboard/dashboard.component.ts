import {Component, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {CourseService} from '../../shared/services/data.service';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  allCourses: ICourse[];

  // UserService for HTML page
  constructor(private courseService: CourseService,
              public userService: UserService,
              private titleService: TitleService) {
    this.allCourses = [];
  }

  ngOnInit() {
    this.titleService.setTitle('Dashboard');
    this.getCourses();
  }

  getCourses() {
    this.courseService.readItems<ICourse>().then(courses => {
      this.allCourses = courses;
      });
  }

  onUpdateCallback() {
      this.getCourses();
  }
}
