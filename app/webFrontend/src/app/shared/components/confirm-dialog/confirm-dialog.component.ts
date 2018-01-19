import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialog {

  public title: string;
  public message: string;
  public confirmText: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialog>) {
  }

}
