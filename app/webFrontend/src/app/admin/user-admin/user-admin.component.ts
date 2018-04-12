import {Component, OnInit} from '@angular/core';
import {UserDataService} from '../../shared/services/data.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MatSnackBar} from '@angular/material';
import {IUser} from '../../../../../../shared/models/IUser';
import {DialogService} from '../../shared/services/dialog.service';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
})
export class UserAdminComponent implements OnInit {

  allUsers: IUser[];
  availableRoles: String[];

  constructor(private userServiceData: UserDataService,
              private router: Router,
              private showProgress: ShowProgressService,
              public  snackBar: MatSnackBar,
              public  dialogService: DialogService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getUsers();
    this.getRoles();
  }

  getAllUsers(): IUser[] {
    return this.allUsers;
  }

  getUsers() {
    this.userServiceData.readItems<IUser>().then(users => {
      this.allUsers = users;
    });
  }

  getRoles() {
    this.userServiceData.getRoles().then(roles => {
      this.availableRoles = roles;
    });
  }

  updateRole(userIndex: number) {
    this.showProgress.toggleLoadingGlobal(true);
    this.userServiceData.updateItem(this.allUsers[userIndex]).then(
      (val) => {
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open('Role of user ' + val.email + ' successfully updated to ' + val.role, '', {duration: 3000});
      },
      (error) => {
        this.snackBar.open(error.error.message, '', {duration: 3000});
        this.showProgress.toggleLoadingGlobal(false);
      }
    );
  }

  editUser(userIndex: number) {
    const link = `/profile/${this.allUsers[userIndex]._id}/edit`;
    this.router.navigate([link]);
  }

  deleteUser(userIndex: number) {
    this.dialogService
    .confirmDelete('user', this.allUsers[userIndex].email)
    .subscribe(res => {
      if (res) {
        this.showProgress.toggleLoadingGlobal(true);
        this.userServiceData.deleteItem(this.allUsers[userIndex]).then(
          (val) => {
            this.showProgress.toggleLoadingGlobal(false);
            this.snackBar.open('User ' + val + ' was successfully deleted.', '', {duration: 3000});
          },
          (error) => {
            this.showProgress.toggleLoadingGlobal(false);
            this.snackBar.open(error, '', {duration: 3000});
          }
        );
      }
    });
  }
}
