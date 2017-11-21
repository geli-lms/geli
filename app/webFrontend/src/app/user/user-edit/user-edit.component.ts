import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {UserDataService} from '../../shared/services/data.service';
import {IUser} from '../../../../../../shared/models/IUser';
import {UserService} from '../../shared/services/user.service';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {matchPasswords} from '../../shared/validators/validators';
import {DialogService} from '../../shared/services/dialog.service';
import {pwPattern} from '../../shared/validators/password'

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  id: string;
  user: IUser;
  userForm: FormGroup;
  passwordPatternText: string;
  changePassword = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private userDataService: UserDataService,
              private showProgress: ShowProgressService,
              private formBuilder: FormBuilder,
              public dialogService: DialogService,
              public snackBar: MatSnackBar) {
    this.generateForm();
  }

  userIsAdmin(): boolean {
    return this.userService.isAdmin();
  }

  ngOnInit() {
    this.passwordPatternText = pwPattern.text;
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);

      if (this.id === 'undefined') {
        this.id = this.userService.user._id;
      }
    });
    this.getUserData();
  }

  getUserData() {
    this.userDataService.readSingleItem(this.id).then(
      (val: any) => {
        this.user = val;
        this.userForm.patchValue({
          profile: {
            firstName: this.user.profile.firstName,
            lastName: this.user.profile.lastName
          },
          email: this.user.email,
        });
      },
      (error) => {
        console.log(error);
        this.snackBar.open(error, 'Dismiss');
      });
  }

  onSubmit() {
    this.user = this.prepareSaveUser();
    this.updateUser();
  }

  onCancel() {
    this.navigateBack();
  }

  prepareSaveUser(): IUser {
    const userFormModel = this.userForm.value;

    const saveUser: any = {};
    const saveIUser: IUser = saveUser;
    for (const key in userFormModel) {
      if (userFormModel.hasOwnProperty(key)) {
        saveIUser[key] = userFormModel[key];
      }
    }

    for (const key in this.user) {
      if (typeof saveIUser[key] === 'undefined') {
        saveIUser[key] = this.user[key];
      }
    }

    return saveIUser;
  }

  updateUser() {
    this.showProgress.toggleLoadingGlobal(true);
    this.userDataService.updateItem(this.user).then(
      (val) => {
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open('Profile successfully updated.', '', {duration: 3000});

        if (this.userService.isLoggedInUser(val)) {
          this.userService.setUser(val);
        }

        this.navigateBack();
      },
      (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        this.snackBar.open(error.json().message, 'Dismiss');
      });
  }

  generateForm() {
    this.userForm = this.formBuilder.group({
      profile: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      username: [''],
      email: ['', Validators.required],
      currentPassword: ['']
    });
  }

  openAddPictureDialog() {
    this.dialogService.upload(this.user)
      .subscribe((response) => {
      if (response) {
        if (response.success) {
          this.userService.setUser(response.user);
          this.snackBar.open('User image successfully uploaded.', '', {duration: 3000});
        }
      }
    });
  }

  private navigateBack() {
    if (this.userService.isLoggedInUser(this.user)) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/profile', this.user._id]);
    }
  }
}
