import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialog {

  public title: string;
  public message: string;
  public confirmText: string;

  constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {
  }

}
