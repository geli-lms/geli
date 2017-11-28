import {OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ICourse} from '../../../../../../shared/models/ICourse';

export abstract class DashboardBaseComponent implements OnInit {

  @Input()
  allCourses: ICourse[];

  @Output()
  onEnroll = new EventEmitter();
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
