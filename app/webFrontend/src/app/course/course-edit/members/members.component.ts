import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {User} from '../../../models/User';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {

  @Input() courseId;
  course: ICourse;
  foundStudents: IUser[] = [];

  constructor(private courseService: CourseService,
              private userService: UserDataService,
              private showProgress: ShowProgressService) {
  }

  ngOnInit() {
    this.initCourseStudentsOnInit();
  }

  /**
   * Get this course from api and filter all teachers from users.
   */
  initCourseStudentsOnInit = () => {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = val;
        this.course.students.forEach(member =>
          this.foundStudents = this.foundStudents.filter(user => user._id !== member._id));
        this.course.students = this.course.students.map(data => new User(data));
      });
  };


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
   * @param id Id of an user.
   */
  updateUser(id: string): void {
    this.foundStudents = this.foundStudents.concat(this.course.students.filter(obj => id === obj._id));
    this.course.students = this.course.students.filter(obj => id !== obj._id);
    this.updateCourseStudents();
  }
}
