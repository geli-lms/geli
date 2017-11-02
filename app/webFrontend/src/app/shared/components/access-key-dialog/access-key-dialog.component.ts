import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'access-key-dialog',
  templateUrl: './access-key-dialog.component.html',
  styleUrls: ['./access-key-dialog.component.css']
})
export class AccessKeyDialog {
  public accessKey: string;

  constructor(public dialogRef: MdDialogRef<AccessKeyDialog>) {
  }
}
