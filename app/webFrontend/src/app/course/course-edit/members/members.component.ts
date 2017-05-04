/** Created by Oliver Neff on 14.04.2017. */
import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/data.service';
import {ShowProgressService} from '../../../shared/show-progress.service';
import {User} from '../../../models/user';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  @Input() courseId;
  course: any;
  members: User[] = [];
  users: User[] = [];
  filterFirstName = '';
  filterLastName = '';

  constructor(private userService: UserDataService,
              private courseService: CourseService,
              private showProgress: ShowProgressService) {
    this.getStudents();
  }

  ngOnInit() {
    console.log('init course members with course id:');
    console.log(this.courseId);
    this.getCourseMembers();
  }

  /**
   * Save all students in this course in database.
   */
  updateMembersInCourse() {
    this.showProgress.toggleLoadingGlobal(true);
    this.courseService.updateItem({'students': this.course.students, '_id': this.courseId}).then(
      (val) => {
        console.log(val);
        this.showProgress.toggleLoadingGlobal(false);
      }, (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        console.log(error);
      });
  }

  /**
   * Switch a user from student to member and back and update this course in database.
   * @param username
   * @param direction
   */
  switchUser(username: string, direction: string) {
    if (direction === 'right') {
      this.members = this.members.concat(this.users.filter(obj => username === obj.username));
      this.users = this.users.filter(obj => !(username === obj.username));
    } else if (direction === 'left') {
      this.users = this.users.concat(this.members.filter(obj => username === obj.username));
      this.members = this.members.filter(obj => !(username === obj.username));
    }
    this.course.students = this.members;
    this.updateMembersInCourse();
  }

  /**
   * Get all users from api and filter those role student.
   */
  getStudents() {
    this.userService.readItems().then(users => {
      this.users = users.filter(obj => obj.role === 'student');
    });
  }

  /**
   * Get this course from api and filter all members from users.
   */
  getCourseMembers() {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = val;
        for (let i = this.users.length - 1; i >= 0; i--) {
          if (this.course.students.includes(this.users[i]._id)) {
            this.members.push(this.users[i]);
            this.users.splice(i, 1);
          }
        }
      }, (error) => {
        console.log(error);
      });
  }

}
