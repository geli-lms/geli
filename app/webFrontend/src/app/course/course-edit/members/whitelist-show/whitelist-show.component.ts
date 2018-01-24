import {Component, OnInit, Output, Input, ViewEncapsulation, EventEmitter} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {CourseService, UserDataService, WhitelistUserService} from '../../../../shared/services/data.service';
import {ProgressService} from '../../../../shared/services/data/progress.service';
import {ShowProgressService} from '../../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../../shared/models/IUser';

@Component({
  selector: 'app-whitelist-show',
  templateUrl: './whitelist-show.component.html',
  styleUrls: ['./whitelist-show.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhitelistShowComponent implements OnInit {

  @Output() onDragendRemoveWhitelist = new EventEmitter<IWhitelistUser>();
  @Input() course: ICourse;
  @Input() show: boolean;


  signedInStudents: IUser[];

  constructor(private courseService: CourseService,
              private showProgress: ShowProgressService,
              private userService: UserDataService,
              private whitelistUserService: WhitelistUserService) {
  }

  ngOnInit() {
    this.userService.searchUsers('student', '').then((res) => {
      this.signedInStudents = res.users;
    });
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

  async remove(user: IWhitelistUser) {
    const idList: string[] = this.course.whitelist.map((u) => u._id);
    const index: number = idList.indexOf(user._id);
    this.course.whitelist.splice(index, 1);

    const idListCourse: string[] = this.course.whitelist.map((c) => c._id);
    const indexCourse: number = idListCourse.indexOf(user._id);
    if (indexCourse >= 0) {
      this.course.whitelist.splice(indexCourse, 1);
      this.updateCourse();
    }
    await this.whitelistUserService.deleteItem(user);
    this.onDragendRemoveWhitelist.emit(user);
  }

  isInCourse(user: IWhitelistUser) {
    if (this.course) {
      const idListCourse: string[] = this.course.students.map((u) =>
        u.profile.firstName.toLowerCase() +
        u.profile.lastName.toLowerCase() +
        u.uid);
      return idListCourse.indexOf(user.firstName + user.lastName + user.uid) >= 0;
    }
    return false;
  }

  isSignedIn(user: IWhitelistUser) {
    if (this.signedInStudents) {
    const idListCourse: string[] = this.signedInStudents.map((u) =>
      u.profile.firstName.toLowerCase() +
      u.profile.lastName.toLowerCase() +
      u.uid);
    return idListCourse.indexOf(user.firstName + user.lastName + user.uid) >= 0;
  }
    return false;
  }

}
