import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'access-key-dialog',
  templateUrl: './access-key-dialog.component.html',
  styleUrls: ['./access-key-dialog.component.scss']
})
export class AccessKeyDialog {
  public accessKey: string;

  constructor(public dialogRef: MatDialogRef<AccessKeyDialog>) {
  }
}
