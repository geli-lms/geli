/** Created by Oliver Neff on 14.04.2017. */
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  @Input() course;

  members: { email: string, role: string, profile: { firstname: string, lastname: string }}[] = [];

  constructor() {
    this.members[0] = {email: 'MaxMüller@gmx.de', role: 'student', profile: {firstname: 'Max', lastname: 'Müller'}};
    this.members[1] = {email: 'FrankWalther@aol.com', role: 'student', profile: {firstname: 'Frank', lastname: 'Walther'}};
    this.members[2] = {email: 'PaulRiebmann@test.com', role: 'teacher', profile: {firstname: 'Paul', lastname: 'Riebmann'}};
    this.members[3] = {email: 'SvenjaMüller@google.de', role: 'admin', profile: {firstname: 'Svenja', lastname: 'Müller'}};
  }

  ngOnInit() {
    console.log('init members...');
    console.log(this.course);
  }

}
