import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../shared/services/data.service';
import {DataSharingService} from '../../../shared/services/data-sharing.service';


@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {
  course: ICourse;

  constructor(private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
    this.course = this.dataSharingService.getDataForKey('course');
  }
}
