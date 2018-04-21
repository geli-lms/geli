import {Component, Input} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {User} from "../../../models/User";

@Component({
  selector: 'app-user-profile-dialog',
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.scss']
})
export class UserProfileDialog {

  @Input() user: User;

  constructor(public dialogRef: MatDialogRef<UserProfileDialog>) {
  }

}
