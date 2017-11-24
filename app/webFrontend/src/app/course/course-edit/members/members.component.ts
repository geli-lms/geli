import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {CourseService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {User} from '../../../models/User';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
})
export class MembersComponent implements OnInit {

  @Input() courseId;

  course: ICourse;
  foundStudents: IUser[] = [];
  showWhitelists =  false;

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

  isUserInCourse(user: IUser) {
    return !isNullOrUndefined(this.course.students.find((elem: IUser) => elem._id === user._id));
  }

  updateCoure(draggedUser: IUser) {
    if (this.isUserInCourse(draggedUser)) { // remove from course
      const idList: string[] = this.course.students.map((u) => u._id);
      const index: number = idList.indexOf(draggedUser._id);
      if (index !== -1) {
        this.course.students.splice(index, 1);
      }
    } else { // add to course
      this.course.students.push(draggedUser);
    }
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

  search(search: string): void {
    if (search.length > 0) {
      this.showWhitelists = true;
    } else {
      this.showWhitelists = false;
    }
  }
}
