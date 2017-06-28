import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SortUtil} from '../../../shared/utils/SortUtil';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  @Input() courseId;
  course: ICourse;
  allTeachers: IUser[] = [];
  courseTeachers: IUser[] = [];

  constructor(private courseService: CourseService,
              private userService: UserDataService,
              private showProgress: ShowProgressService) {
    this.getTeachers();
  }

  ngOnInit() {
    this.getCourseTeachers();
  }

  /**
   * Get all users from api and filter those role student.
   */
  getTeachers(): void {
    this.userService.readItems().then(users => {
      this.allTeachers = users.filter(obj => obj.role === 'teacher');
    });
    SortUtil.sortUsers(this.courseTeachers);
  }
  /**
   * Save all teachers in this course in database.
   */
  updateCourse(teachers: IUser[]): void {
    this.showProgress.toggleLoadingGlobal(true);
    this.course.teachers = teachers;
    this.courseService.updateItem({'teachers': this.course.teachers, '_id': this.courseId}).then(
      (val) => {
        this.showProgress.toggleLoadingGlobal(false);
      }, (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        console.log(error);
      });
  }

  /**
   * Get this course from api and filter all teachers from users.
   */
  getCourseTeachers(): void {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = val;
        this.courseTeachers = this.course.teachers;

        this.courseTeachers.forEach(member =>
          this.allTeachers = this.allTeachers.filter(function (user) {
            return user._id !== member._id;
          }));
        SortUtil.sortUsers(this.allTeachers);
      }, (error) => {
        console.log(error);
      });
  }
  /**
   * @param id Id of an user.
   */
  removeUser(id: string): void {
    this.allTeachers = this.allTeachers.concat(this.courseTeachers.filter(obj => id === obj._id));
    this.courseTeachers = this.courseTeachers.filter(obj => !(id === obj._id));
    SortUtil.sortUsers(this.courseTeachers);
    SortUtil.sortUsers(this.allTeachers);
    this.updateCourse(this.courseTeachers);
  }

}
