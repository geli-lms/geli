/** Created by Oliver Neff on 14.04.2017. */
import {Component, Input, OnInit} from '@angular/core';
import {UserDataService} from '../../../shared/data.service';
import {ShowProgressService} from '../../../shared/show-progress.service';
import {CourseService} from '../../../shared/data.service';
import {User} from '../../../models/user';
import {ActivatedRoute} from '@angular/router';
import {log} from 'util';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  @Input() course;
  @Input() courseId;
  members: User[] = [];
  users: User[] = [];

  constructor(
    private userService: UserDataService,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private showProgress: ShowProgressService) {
    this.getUsers();
  }

  ngOnInit() {
    console.log('init users...');
    console.log(this.course);
}

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

  getUsers() {
    this.userService.readItems().then(users => {
      this.users = users;
    });
  }

}
