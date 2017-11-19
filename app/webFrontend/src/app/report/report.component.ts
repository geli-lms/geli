import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../shared/services/data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

  public courseId: string;
  public courseName: string;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = decodeURIComponent(params['id']);
    });
    this.getCourseData();
  }

  private getCourseData() {
    this.courseService.readSingleItem(this.courseId)
      .then((course: any) => {
        this.courseName = course.name;
      })
      .catch((err) => {
      });
  }
}
