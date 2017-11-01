import {Component, OnInit} from '@angular/core';
import {UserDataService} from '../../shared/services/data.service';
import {Router} from '@angular/router';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {MdSnackBar} from '@angular/material';
import {IUser} from '../../../../../../shared/models/IUser';
import {DialogService} from '../../shared/services/dialog.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent implements OnInit {

  allUsers: IUser[];
  availableRoles: String[];

  constructor(private userService: UserDataService,
              private router: Router,
              private showProgress: ShowProgressService,
              public  snackBar: MdSnackBar,
              public  dialogService: DialogService) {
  }

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
        this.snackBar.open('Role of user ' + val.email + ' successfully updated to ' + val.role, '', {duration: 3000});
      },
      (error) => {
        this.showProgress.toggleLoadingGlobal(false);
      }
    );
  }

  deleteUser(userIndex: number) {
    this.dialogService
    .confirmDelete('user', this.allUsers[userIndex].email)
    .subscribe(res => {
      if (res) {
        this.showProgress.toggleLoadingGlobal(true);
        this.userService.deleteItem(this.allUsers[userIndex]).then(
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

  resetUserPassword(userIndex: number) {
    this.dialogService
      .confirmUpdate('property', 'password', this.allUsers[userIndex].email)
      .subscribe(res => {
        if (res) {
          const user = this.allUsers[userIndex];
          user.password = this.generatePass(12);
          this.showProgress.toggleLoadingGlobal(true);
          this.userService.updateItem(user).then(
            (val) => {
              this.showProgress.toggleLoadingGlobal(false);
              this.dialogService.info('Password successfully updated', 'Password for user ' + this.allUsers[userIndex].email + ' was updated to: \'' + user.password + '\'')
                .subscribe(() => this.snackBar.open('Password updated', '', {duration: 3000}));
            },
            (error) => {
              this.showProgress.toggleLoadingGlobal(false);
              this.snackBar.open(JSON.parse(error._body).message, '', {duration: 3000});
            }
          );
        }
      });
  }

  generatePass(length: number): string {
    let pass = "";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      pass += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return pass;
  }
}
