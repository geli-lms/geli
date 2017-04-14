import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../shared/data.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {

  allUsers: User[];

  constructor(private userService: UserDataService,
              private router: Router) {
    this.getUsers();
  }

  ngOnInit() {
  }

  getAllUsers(): User[] {
    return this.allUsers;
  }

  getUsers() {
    this.userService.readItems().then(users => {
      this.allUsers = users;
    });
  }

}
