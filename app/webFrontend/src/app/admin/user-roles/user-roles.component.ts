import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../shared/data.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/show-progress.service';
import {MdSnackBar} from '@angular/material';
import {IUser} from '../../../../../../shared/models/IUser';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {

  allUsers: IUser[];
  availableRoles: String[];

  constructor(private userService: UserDataService,
              private router: Router,
              private showProgress: ShowProgressService,
              public  snackBar: MdSnackBar) {}

  ngOnInit() {
    this.getUsers();
    this.getRoles();
  }

  getAllUsers(): IUser[] {
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
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open('Role of user ' + val._id + ' successfully updated to ' + val.role, '', { duration: 3000 });
      },
      (error) => {
        this.showProgress.toggleLoadingGlobal(false);
      }
    );
  }
}
