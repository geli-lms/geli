import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {UserDataService} from '../../shared/services/data.service';
import {IUser} from '../../../../../../shared/models/IUser';
import {UserService} from '../../shared/services/user.service';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {DialogService} from '../../shared/services/dialog.service';
import {TitleService} from '../../shared/services/title.service';

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
              public snackBar: MatSnackBar,
              private titleService: TitleService,
              private cdRef: ChangeDetectorRef) {
    this.generateForm();
  }

  showPwFields() {
    if (this.user) {
      return this.userService.user._id === this.user._id;
    }
    return false;
  }

  ngOnInit() {
    this.titleService.setTitle('Edit User');
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
      if (this.id === 'undefined') {
        this.id = this.userService.user._id;
      }
    });
    this.getUserData();
  }

  async getUserData() {
    try {
      const user = await this.userDataService.readSingleItem(this.id);
      this.user = <any>user;
      this.userForm.patchValue({
        profile: {
          firstName: this.user.profile.firstName,
          lastName: this.user.profile.lastName
        },
        email: this.user.email,
      });
      this.titleService.setTitleCut(['Edit User: ', this.user.profile.firstName]);
    } catch (error) {
      this.snackBar.open(error.json().message, 'Dismiss');
    }
    this.cdRef.detectChanges();
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

  async updateUser() {
    this.showProgress.toggleLoadingGlobal(true);
    try {
      const user = await this.userDataService.updateItem(this.user);
      this.snackBar.open('Profile successfully updated.', '', {duration: 3000});

      if (this.userService.isLoggedInUser(user)) {
        this.userService.setUser(user);
      }
      this.navigateBack();
    } catch (error) {
      this.snackBar.open(error.json().message, 'Dismiss');
    }
    this.showProgress.toggleLoadingGlobal(false);
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

  async resetPassword() {
    const confirm = await this.dialogService.confirmUpdate('property', 'password', this.user.email).toPromise();
    if (!confirm) {
      return false;
    }
    this.user.password = this.generatePass(12);
    this.showProgress.toggleLoadingGlobal(true);
    const user = await this.userDataService.updateItem(this.user);
    try {
      if (!user) {
        throw new Error('an unknown error occured');
      }
      await this.dialogService.info(
        'Password successfully updated',
        'Password for user ' + this.user.email + ' was updated to: \'' + this.user.password + '\'').toPromise();
      this.snackBar.open('Password updated', '', {duration: 3000});
    } catch (error) {
      this.snackBar.open(error.json().message, '', {duration: 3000});
    }
    this.showProgress.toggleLoadingGlobal(false);
  }

  async openAddPictureDialog() {
    const response = await this.dialogService.upload(this.user).toPromise();
    if (response && response.success && response.user) {
      if (this.userService.isLoggedInUser(response.user)) {
        this.userService.setUser(response.user);
      }
      this.snackBar.open('User image successfully uploaded.', '', {duration: 3000});
    }
  }

  private navigateBack() {
    if (this.userService.isLoggedInUser(this.user)) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/profile', this.user._id]);
    }
  }

  private generatePass(length: number): string {
    let pass = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?/$%&()[]{}';

    for (let i = 0; i < length; i++) {
      pass += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return pass;
  }
}
