import { Component, OnInit } from '@angular/core';
import {Course} from '../../models/course';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  course: Course;

  name: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => { this.name = decodeURIComponent(params['name']); });
  }

  apply() {
      console.log('apply');
  }
}
