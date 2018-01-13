import {Component, Input, OnInit} from '@angular/core';
import {CourseService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {isNullOrUndefined} from 'util';
import {IWhitelistUser} from '../../../../../../../shared/models/IWhitelistUser';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {

  @Input() course: ICourse;
  totalWhitelist = 0;
  foundStudents: IUser[] = [];
  dragableWhitelistUserInCourse: IWhitelistUser[] = [];
  showWhitelists = false;
  search = '';

  constructor(private courseService: CourseService,
              private showProgress: ShowProgressService) {
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
    this.course.students.splice(idList.indexOf(draggedUser._id), 1);
    this.updateCourseStudents();
  }

  pushUserToCourse(draggedUser: IUser) {
    this.course.students.push(draggedUser);
    this.updateCourseStudents();
  }

  removeWhitelistUserFromCourse(draggedUser: IWhitelistUser) {
    const idList: string[] = this.course.whitelist.map((u) => u._id);
    this.course.whitelist.splice(idList.indexOf(draggedUser._id), 1);
    this.updateCourseStudents();
  }

  pushWhitelistUserToCourse(draggedUser: IWhitelistUser) {
    this.course.whitelist.push(draggedUser);
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
    this.showWhitelists = search.length > 0;
  }

  onFoundWhitelistUserInCourse(users: IWhitelistUser[]) {
    this.dragableWhitelistUserInCourse = users;
  }
}
