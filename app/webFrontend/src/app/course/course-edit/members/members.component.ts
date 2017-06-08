/** Created by Oliver Neff on 14.04.2017. */
import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SortUtil} from '../../../shared/utils/SortUtil';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  @Input() courseId;
  course: ICourse;
  members: IUser[] = [];
  users: IUser[] = [];

  constructor(private userService: UserDataService,
              private courseService: CourseService,
              private showProgress: ShowProgressService) {
    this.getStudents();
  }

  ngOnInit() {
    this.getCourseMembers();
  }

  /**
   *
   * @param members
   */
  private updateMembers(members: IUser[]): void {
    this.course.students = members;
  }

  /**
   * Save all students in this course in database.
   */
  private updateCourse(): void {
    this.showProgress.toggleLoadingGlobal(true);
    this.course.students = this.members;
    this.courseService.updateItem({'students': this.course.students, '_id': this.courseId}).then(
      (val) => {
        this.showProgress.toggleLoadingGlobal(false);
      }, (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        console.log(error);
      });
  }

  /**
   * Switch a user from student to member and back and update this course in database.
   * @param id Id of an user.
   */
  private removeUser(id: string): void {
    this.users = this.users.concat(this.members.filter(obj => id === obj._id));
    this.members = this.members.filter(obj => !(id === obj._id));
    SortUtil.sortUsers(this.members);
    SortUtil.sortUsers(this.users);
    this.updateCourse();
  }

  /**
   * Get all users from api and filter those role student.
   */
  private getStudents(): void {
    this.userService.readItems().then(users => {
      this.users = users.filter(obj => obj.role === 'student');
    });
    SortUtil.sortUsers(this.members);
  }

  /**
   * Get this course from api and filter all members from users.
   */
  private getCourseMembers(): void {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = val;
        this.members = this.course.students;

        this.members.forEach(member =>
          this.users = this.users.filter(function (user) {
            return user._id !== member._id;
          }));
        SortUtil.sortUsers(this.users);
      }, (error) => {
        console.log(error);
      }
    );
  }
}
