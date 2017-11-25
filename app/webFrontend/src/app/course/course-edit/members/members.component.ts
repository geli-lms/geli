import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {CourseService, UserDataService, WhitelistUserService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {User} from '../../../models/User';
import {isNullOrUndefined} from 'util';
import {IWhitelistUser} from '../../../../../../../shared/models/IWhitelistUser';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {

  @Input() course: ICourse;
  foundStudents: IUser[] = [];
  showWhitelists = false;
  search = '';
  total = 0;
  totalWhitelist = 0;
  dragulaWhitelistBagId = 'whitelist';

  constructor(private courseService: CourseService,
              private showProgress: ShowProgressService,
              private userService: UserDataService,
              private whitelistUserService: WhitelistUserService) {
  }

  ngOnInit() {
    this.initCourseStudentsOnInit();
  }

  /**
   * Get this course from api and filter all teachers from users.
   */
  initCourseStudentsOnInit = () => {
    this.course.students.forEach(member =>
      this.foundStudents = this.foundStudents.filter(user => user._id !== member._id));
  };


  /**
   * Save all students in this course in database.
   */
  updateCourseStudents(): void {
    this.showProgress.toggleLoadingGlobal(true);
    this.courseService.updateItem({
      '_id': this.course._id,
      'students': this.course.students.map((user) => user._id),
      'whitelist': this.course.whitelist.map((wUser) => wUser._id)
    })
      .then(() => {
        this.showProgress.toggleLoadingGlobal(false);
      });
  }

  isUserInCourse(user: IUser) {
    return !isNullOrUndefined(this.course.students.find((elem: IUser) => elem._id === user._id));
  }

  removeUserFromCoure(draggedUser: IUser) {
    const idList: string[] = this.course.students.map((u) => u._id);
    const index: number = idList.indexOf(draggedUser._id);
    this.course.students.splice(index, 1);
    this.userService.countUsers('student').then((count) => {
        this.total = count - this.course.students.length;
      }
    );
    this.updateCourseStudents();
  }

  pushUserToCourse(draggedUser: IUser) {
    this.course.students.push(draggedUser);
    this.userService.countUsers('student').then((count) => {
        this.total = count - this.course.students.length;
      }
    );
    this.updateCourseStudents();
  }

  removeWhitelistUserFromCourse(draggedUser: IWhitelistUser) {
    const idList: string[] = this.course.whitelist.map((u) => u._id);
    const index: number = idList.indexOf(draggedUser._id);
    this.course.whitelist.splice(index, 1);
    this.whitelistUserService.countWhitelistUsers(this.course._id).then((count) => {
        this.totalWhitelist = count - this.course.whitelist.length;
      }
    );
    this.updateCourseStudents();
  }

  pushWhitelistUserToCourse(draggedUser: IWhitelistUser) {
    this.course.whitelist.push(draggedUser);
    this.whitelistUserService.countWhitelistUsers(this.course._id).then((count) => {
        this.totalWhitelist = count - this.course.whitelist.length;
      }
    );
    this.updateCourseStudents();
  }


  /**
   * @param id Id of an user.
   */
  updateUser(id: string): void {
    this.foundStudents = this.foundStudents.concat(this.course.students.filter(obj => id === obj._id));
    this.course.students = this.course.students.filter(obj => id !== obj._id);
    this.updateCourseStudents();
  }

  onSearch(search: string): void {
    this.search = search;
    this.userService.countUsers('student').then((count) => {
        this.total = count - this.course.students.length;
      }
    );
    this.whitelistUserService.countWhitelistUsers(this.course._id).then((count) => {
        this.totalWhitelist = count - this.course.whitelist.length;
      }
    );
    this.showWhitelists = search.length > 0;
  }
}
