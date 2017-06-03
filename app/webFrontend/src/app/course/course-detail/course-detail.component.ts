import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {CourseService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  course: ICourse;

  taskId: string = '591db56e169193023ad1f716';
  id: string;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService) { }

  ngOnInit() {
    this.route.params.subscribe(params => { this.id = decodeURIComponent(params['id']); });
    this.getCourse(this.id);
  }

  getCourse(courseId: string) {
    this.courseService.readSingleItem(courseId).then((course: any) =>  {
      this.course = course;
    });
  }

  apply() {
      console.log('apply');
  }
}
