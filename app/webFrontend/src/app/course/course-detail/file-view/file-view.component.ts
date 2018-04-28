import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CourseService} from '../../../shared/services/data.service';
import {DataSharingService} from '../../../shared/services/data-sharing.service';


@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {
  course: ICourse;

  constructor(private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
    this.course = this.dataSharingService.getDataForKey('course');




  }



}
