import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../shared/services/data.service';


@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {
  course: ICourse;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const courseId = decodeURIComponent(params['id']);
      this.courseService.readSingleItem(courseId).then(
              (course: any) => {
                this.course = course;
         });
    });
  }


}
