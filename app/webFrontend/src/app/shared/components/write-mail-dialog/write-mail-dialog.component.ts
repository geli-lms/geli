import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {IUser} from '../../../../../../../shared/models/IUser';
import {MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-write-mail-dialog',
  templateUrl: './write-mail-dialog.component.html',
  styleUrls: ['./write-mail-dialog.component.scss']
})
export class WriteMailDialog implements OnInit {

  @Input() to: String;
  subject = '';
  text = '';

  constructor(
    public dialogRef: MatDialogRef<WriteMailDialog>
  ) {}

  ngOnInit() {
  }

  public cancel() {
    this.dialogRef.close(false);
  }

  public sendMail() {
    this.dialogRef.close({
      to: this.to,
      subject: this.subject,
      text: this.text,
    });
  }
}
