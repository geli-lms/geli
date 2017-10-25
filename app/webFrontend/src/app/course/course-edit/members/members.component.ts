import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SortUtil} from '../../../shared/utils/SortUtil';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {

  @Input() courseId;
  course: ICourse;
  allStudents: IUser[] = [];

  constructor(private courseService: CourseService,
              private userService: UserDataService,
              private showProgress: ShowProgressService) {
  }

  ngOnInit() {
    this.getStudents().then(this.getCourseStudents);
  }

  /**
   * Get all users from api and filter those role student.
   *
   * TODO: Never load all users!
   */
  getStudents() {
    return this.userService.readItems().then(users => {
      this.allStudents = users.filter(obj => obj.role === 'student');
    });
  }

  /**
   * Save all students in this course in database.
   */
  updateCourseStudents(): void {
    this.showProgress.toggleLoadingGlobal(true);

    this.courseService.updateItem({
      '_id': this.course._id,
      'students': this.course.students.map((user) => user._id)
    })
    .then(() => {
      this.showProgress.toggleLoadingGlobal(false);
    });
  }

  /**
   * Get this course from api and filter all teachers from users.
   */
  getCourseStudents = () => {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = val;
        this.course.students.forEach(member =>
          this.allStudents = this.allStudents.filter(user => user._id !== member._id));
        SortUtil.sortUsers(this.allStudents);
        SortUtil.sortUsers(this.course.students);
      });
  }

  /**
   * @param id Id of an user.
   */
  removeUser(id: string): void {
    this.allStudents = this.allStudents.concat(this.course.students.filter(obj => id === obj._id));
    this.course.students = this.course.students.filter(obj => id !== obj._id);
    this.updateCourseStudents();
  }
}
