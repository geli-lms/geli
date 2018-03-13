import {Component, Input, OnInit} from '@angular/core';
import {IUser} from '../../../../../../../shared/models/IUser';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {FormGroup, FormBuilder} from '@angular/forms';
import {UserDataService} from '../../services/data.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  @Input() user: IUser;
  pwForm: FormGroup;

  constructor( private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
               private formBuilder: FormBuilder,
               private userService: UserService,
              private userDataService: UserDataService,
               public snackBar: MatSnackBar) {
    this.generateForm();
  }

  ngOnInit() {

  }

  generateForm() {
    this.pwForm = this.formBuilder.group({
      currentPassword: ['']
    });
  }

  isSameUser() {
    if (this.user) {
      return this.userService.user._id === this.user._id
    }
    return false;
  }

  public cancel() {
    this.dialogRef.close({success: false});
  }

 prepUser(): IUser {
   const pwFormModel = this.pwForm.value;
   const saveUser: any = {};
   const saveIUser: IUser = saveUser;
   for (const key in pwFormModel) {
     if (pwFormModel.hasOwnProperty(key)) {
       saveIUser[key] = pwFormModel[key];
     }
   }
   for (const key in this.user) {
     if (typeof saveIUser[key] === 'undefined') {
       saveIUser[key] = this.user[key];
     }
   }
   return saveIUser;
  }

  async onSubmit() {
    this.user = await this.prepUser();
    try {
      const user = await this.userDataService.updateItem(this.user);
      this.snackBar.open('Password successfully updated.', '', {duration: 3000});
      this.dialogRef.close();
    } catch (error) {
      console.dir(error);
      const errormsg = error.error.message;
      this.snackBar.open(errormsg, 'Dismiss');
    }
  }
}
