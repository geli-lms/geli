import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
})
export class TeachersComponent implements OnInit {

  @Input() course: ICourse;
  courseId: string;
  total = 0;
  foundTeachers: IUser[] = [];

  constructor(private route: ActivatedRoute,
              private courseService: CourseService,
              private userService: UserDataService,
              private showProgress: ShowProgressService) {
    this.route.parent.params.subscribe(params => {
      this.courseId = params['id'];
    });
  }

  ngOnInit() {
    this.courseService.readCourseToEdit(this.courseId).then((course: ICourse) => {
      this.course = course;
      this.course.teachers.forEach(member =>
        this.foundTeachers = this.foundTeachers.filter(user => user._id !== member._id)
      );
    });
  }

  isUserInCourse(user: IUser) {
    return !isNullOrUndefined(this.course.teachers.find((elem: IUser) => elem._id === user._id));
  }

  removeFromCoure(draggedUser: IUser) {
    this.course.teachers = this.course.teachers.filter(t => t._id !== draggedUser._id);
    this.updateCourseTeachers();
  }

  pushToCoure(draggedUser: IUser) {
    this.course.teachers.push(draggedUser);
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
}
