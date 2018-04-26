import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CourseService} from '../../../shared/services/data.service';


@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {
  @Input() course: ICourse;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const courseId = decodeURIComponent(params['id']);
      console.log(courseId);
      this.courseService.readSingleItem(courseId).then(
        (course: any) => {
          this.course = course;
        });
    });
  }



}
