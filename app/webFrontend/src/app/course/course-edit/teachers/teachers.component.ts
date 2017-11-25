import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {User} from '../../../models/User';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
})
export class TeachersComponent implements OnInit {


  @Input() course: ICourse;
  foundTeachers: IUser[] = [];
  total = 0;

  constructor(private courseService: CourseService,
              private showProgress: ShowProgressService,
              private userService: UserDataService) {
  }

  ngOnInit() {
    this.initCourseTeachersOnInit();
  }

  /**
   * Get this course from api and filter all teachers from users.
   */
  initCourseTeachersOnInit = () => {
        this.course.teachers.forEach(member =>
          this.foundTeachers = this.foundTeachers.filter(user => user._id !== member._id));
  };

  isUserInCourse(user: IUser) {
    return !isNullOrUndefined(this.course.teachers.find((elem: IUser) => elem._id === user._id));
  }

  removeFromCoure(draggedUser: IUser) {
    const idList: string[] = this.course.teachers.map((u) => u._id);
    const index: number = idList.indexOf(draggedUser._id);
    this.course.teachers.splice(index, 1);
    this.userService.countUsers('teacher').then((count) => {
        this.total = count - this.course.teachers.length;
      }
    );
    this.updateCourseTeachers();
  }

  pushToCoure(draggedUser: IUser) {
    this.course.teachers.push(draggedUser);
    this.userService.countUsers('teacher').then((count) => {
        this.total = count - this.course.teachers.length;
      }
    );
    this.updateCourseTeachers();
  }

  /**
   * Save all teachers in this course in database.
   */
  updateCourseTeachers(): void {
    this.showProgress.toggleLoadingGlobal(true);

    this.courseService.updateItem({
      '_id': this.course._id,
      'teachers': this.course.teachers.map((user) => user._id)
    })
      .then(() => {
        this.showProgress.toggleLoadingGlobal(false);
      });
  }

  /**
   * @param id Id of an user.
   */
  updateUser(id: string): void {
    this.foundTeachers = this.foundTeachers.concat(this.course.teachers.filter(obj => id === obj._id));
    this.course.teachers = this.course.teachers.filter(obj => id !== obj._id);
    this.updateCourseTeachers();
  }

  search(search: string): void {
    this.userService.countUsers('teacher').then((count) => {
        this.total = count - this.course.teachers.length;
      }
    )
  }
}
