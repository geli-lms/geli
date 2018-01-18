import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {User} from '../../../../models/User';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';

@Component({
  selector: 'app-course-user-list-show',
  templateUrl: './course-user-list-show.component.html',
  styleUrls: ['./course-user-list-show.component.scss'],
})
export class CourseUserListShowComponent implements OnInit {

  @Input() dragUsers: any = [];
  @Input() dragulaBagId;
  @Input() fieldId: string;
  @Input() show: boolean;

  constructor() {
  }

  ngOnInit() {
  }
}
