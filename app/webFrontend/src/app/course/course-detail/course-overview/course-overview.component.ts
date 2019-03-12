import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../../shared/services/data.service';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {ILecture} from "../../../../../../../shared/models/ILecture";


@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {
  course: ICourse;
  openAllLectures = true;
  currentSection;
  lectureScrollEmitter: EventEmitter<ILecture>;


  onLectureChange(lectureId: string) {
    this.currentSection = lectureId;
    let activeLecture = this.course.lectures.find(lecture => lecture._id == lectureId);
    this.lectureScrollEmitter.emit(activeLecture);
  }

  constructor(private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
    this.course = this.dataSharingService.getDataForKey('course');

    this.lectureScrollEmitter = this.dataSharingService.getDataForKey('lectureScrollEmitter');

  }

  toggleAllLectures() {
    this.openAllLectures = !this.openAllLectures;
  }

}
