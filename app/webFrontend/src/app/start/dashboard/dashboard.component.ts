import {Component, OnInit} from '@angular/core';
import {ICourseDashboard} from '../../../../../../shared/models/ICourseDashboard';
import {UserService} from '../../shared/services/user.service';
import {CourseService} from '../../shared/services/data.service';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  allCourses: ICourseDashboard[];

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

  async getCourses() {
    this.allCourses = await this.courseService.readItems<ICourseDashboard>();
  }

  onUpdateCallback() {
    this.getCourses();
  }
}
