import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {User} from '../../../models/User';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
})
export class TeachersComponent implements OnInit {

  courseId: string;
  course: ICourse;
  allTeachers: IUser[] = [];

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private userService: UserDataService,
              private showProgress: ShowProgressService) {
    this.route.parent.params.subscribe(params => {
      this.courseId = params['id'];
    });
  }

  ngOnInit() {
    this.getTeachers().then(this.getCourseTeachers);
  }

  /**
   * Get all users from api and filter those role teacher.
   *
   * TODO: Never load all users!
   */
  getTeachers() {
    return this.userService.readItems().then(users => {
      this.allTeachers = users.filter(obj => obj.role === 'teacher');
      this.allTeachers = this.allTeachers.map(data => new User(data));
    });
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
   * Get this course from api and filter all teachers from users.
   */
  getCourseTeachers = () => {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = val;
        this.course.teachers.forEach(member =>
          this.allTeachers = this.allTeachers.filter(user => user._id !== member._id));
        this.course.teachers = this.course.teachers.map(data => new User(data));

        SortUtil.sortUsers(this.allTeachers);
        SortUtil.sortUsers(this.course.teachers);
      });
  };

  /**
   * @param id Id of an user.
   */
  removeUser(id: string): void {
    this.allTeachers = this.allTeachers.concat(this.course.teachers.filter(obj => id === obj._id));
    this.course.teachers = this.course.teachers.filter(obj => id !== obj._id);
    this.updateCourseTeachers();
  }
}
