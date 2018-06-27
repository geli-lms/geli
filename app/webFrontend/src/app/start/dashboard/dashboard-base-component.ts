import {OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ICourseDashboard} from '../../../../../../shared/models/ICourseDashboard';

export abstract class DashboardBaseComponent implements OnInit {

  @Input()
  allCourses: ICourseDashboard[];

  @Output()
  onEnroll = new EventEmitter();
  @Output()
  onLeave = new EventEmitter();

  constructor() {

  }

  ngOnInit() {
  }

  async filterCourses(searchValue: string, tempCourses: ICourseDashboard[], courses: ICourseDashboard[]) {
    for (const course of tempCourses) {
      const temp = course.name.toLowerCase();
      if (temp.includes(searchValue)) {
        courses.push(course);
      }
    }
  }

  leaveCallback() {
    this.onLeave.emit();
  }

  enrollCallback() {
    this.onEnroll.emit();
  }
}
