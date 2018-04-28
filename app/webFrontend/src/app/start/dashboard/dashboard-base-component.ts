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

  leaveCallback() {
    this.onLeave.emit();
  }

  enrollCallback() {
    this.onEnroll.emit();
  }
}
