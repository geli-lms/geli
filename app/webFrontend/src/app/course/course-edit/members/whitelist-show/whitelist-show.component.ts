import {Component, OnInit, Output, Input, ViewEncapsulation, EventEmitter} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {CourseService, WhitelistUserService} from '../../../../shared/services/data.service';
import {ProgressService} from '../../../../shared/services/data/progress.service';
import {ShowProgressService} from '../../../../shared/services/show-progress.service';

@Component({
  selector: 'app-whitelist-show',
  templateUrl: './whitelist-show.component.html',
  styleUrls: ['./whitelist-show.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhitelistShowComponent implements OnInit {

  @Input() dragUsers: any = [];
  @Input() dragulaBagId;
  @Input() show: boolean;
  @Input() fieldId: string;
  @Input() course: ICourse;

  constructor(private courseService: CourseService,
              private showProgress: ShowProgressService,
              private whitelistUserService: WhitelistUserService) {
  }

  ngOnInit() {
  }

  updateCourse(): void {
    this.showProgress.toggleLoadingGlobal(true);
    this.courseService.updateItem({
      '_id': this.course._id,
      'whitelist': this.course.whitelist.map((wUser) => wUser._id)
    })
      .then(() => {
        this.showProgress.toggleLoadingGlobal(false);
      });
  }

  remove(user: IWhitelistUser) {
    const idList: string[] = this.dragUsers.map((u) => u._id);
    const index: number = idList.indexOf(user._id);
    this.dragUsers.splice(index, 1);

    const idListCourse: string[] = this.course.whitelist.map((c) => c._id);
    const indexCourse: number = idListCourse.indexOf(user._id);
    if (indexCourse) {
      this.course.whitelist.splice(indexCourse, 1);
      this.updateCourse();
    }
    this.whitelistUserService.deleteItem(user);
  }

  isInCourse(user: IWhitelistUser) {
    const idListCourse: string[] = this.course.students.map((u) =>
      u.profile.firstName.toLowerCase() +
      u.profile.lastName.toLowerCase() +
      u.uid);
    return idListCourse.indexOf(user.firstName + user.lastName + user.uid) >= 0;
  }
}
