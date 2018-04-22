import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {isNullOrUndefined} from 'util';
import {IWhitelistUser} from '../../../../../../../shared/models/IWhitelistUser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {

  course: ICourse;
  courseId: string;
  totalWhitelist = 0;
  foundStudents: IUser[] = [];
  showWhitelists = false;
  search = '';

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private userService: UserDataService,
              private showProgress: ShowProgressService) {
    this.route.parent.params.subscribe(params => {
      this.courseId = params['id'];
    });
  }

  async ngOnInit() {
    await this.initCourse();
  }

  async initCourse() {
    await this.courseService.readCourseToEdit(this.courseId).then((course: ICourse) => {
      this.course = course;
      this.course.students.forEach(member =>
        this.foundStudents = this.foundStudents.filter(user => user._id !== member._id)
      );
    });
  }

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
    this.course.students = this.course.students.filter(s => s._id !== draggedUser._id);
    this.updateCourseStudents();
  }

  pushUserToCourse(draggedUser: IUser) {
    this.course.students.push(draggedUser);
    this.updateCourseStudents();
  }

  async removeWhitelistUserFromCourse(draggedUser: IWhitelistUser) {
    await this.initCourse();
  }

  async pushWhitelistUserToCourse(draggedUser: IWhitelistUser) {
    await this.initCourse();
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
}
