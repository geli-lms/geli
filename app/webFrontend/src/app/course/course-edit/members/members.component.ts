/** Created by Oliver Neff on 14.04.2017. */
import {Component, Input, OnInit} from '@angular/core';
import {ShowProgressService} from '../../../shared/show-progress.service';
import {CourseService} from '../../../shared/data.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  @Input() course;

  members = [];
  users: { email: string, role: string, profile: { firstname: string, lastname: string } }[] = [];

  constructor(
    private courseService: CourseService,
    private showProgress: ShowProgressService) {
    this.users[0] = {email: 'MaxMüller@gmx.de', role: 'student', profile: {firstname: 'Max', lastname: 'Müller'}};
    this.users[1] = {
      email: 'FrankWalther@aol.com',
      role: 'student',
      profile: {firstname: 'Frank', lastname: 'Walther'}
    };
    this.users[2] = {
      email: 'PaulRiebmann@test.com',
      role: 'teacher',
      profile: {firstname: 'Paul', lastname: 'Riebmann'}
    };
    this.users[3] = {
      email: 'SvenjaMüller@google.de',
      role: 'admin',
      profile: {firstname: 'Svenja', lastname: 'Müller'}
    };
  }

  ngOnInit() {
    console.log('init users...');
    console.log(this.course);
  }

  updateMembersInCourse() {
    this.showProgress.toggleLoadingGlobal(true);
    console.log(this.course);

    this.courseService.updateItem({'name': this.course}).then(
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
      this.members = this.members.concat(this.users.filter(obj => username === obj.email));
      this.users = this.users.filter(obj => !(username === obj.email));
    } else if (direction === 'left') {
      this.users = this.users.concat(this.members.filter(obj => username === obj.email));
      this.members = this.members.filter(obj => !(username === obj.email));
    }
  }

}
