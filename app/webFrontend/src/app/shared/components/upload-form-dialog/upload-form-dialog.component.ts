import {Component, OnInit} from '@angular/core';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {UploadDialog} from '../upload-dialog/upload-dialog.component';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';

@Component({
  selector: 'app-upload-form-dialog',
  templateUrl: './upload-form-dialog.component.html',
  styleUrls: ['./upload-form-dialog.component.scss']
})
export class UploadFormDialogComponent implements OnInit {

  uploadPath = '/';

  constructor(public dialogRef: MatDialogRef<UploadDialog>,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  onFileUploaded(event: IFileUnit) {
  }

  onAllUploaded() {
  }

  public upload() {
    this.dialogRef.close(true);
  }

  public cancel() {
    this.dialogRef.close(false);
  }

}
