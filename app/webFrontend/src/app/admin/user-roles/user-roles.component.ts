import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../shared/data.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/show-progress.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {

  allUsers: User[];
  availableRoles: String[];

  constructor(private userService: UserDataService,
              private router: Router,
              private showProgress: ShowProgressService) {}

  ngOnInit() {
    this.getUsers();
    this.getRoles();
  }

  getAllUsers(): User[] {
    return this.allUsers;
  }

  getUsers() {
    this.userService.readItems().then(users => {
      this.allUsers = users;
    });
  }

  getRoles() {
    this.userService.getRoles().then(roles => {
      this.availableRoles = roles;
    });
  }

  updateRole(userIndex: number) {
    this.showProgress.toggleLoadingGlobal(true);
    this.userService.updateItem(this.allUsers[userIndex]).then(
      (val) => {
        console.log(val);
        this.showProgress.toggleLoadingGlobal(false);
      },
      (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        console.log(error);
      }
    );
  }
}
