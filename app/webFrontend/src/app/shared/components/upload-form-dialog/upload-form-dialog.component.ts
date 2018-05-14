import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {SnackBarService} from '../../services/snack-bar.service';
import {UploadDialog} from '../upload-dialog/upload-dialog.component';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {UploadFormComponent} from '../upload-form/upload-form.component';

@Component({
  selector: 'app-upload-form-dialog',
  templateUrl: './upload-form-dialog.component.html',
  styleUrls: ['./upload-form-dialog.component.scss']
})
export class UploadFormDialog implements OnInit {

  @ViewChild(UploadFormComponent)
  public uploadForm: UploadFormComponent;

  uploadPathTmp = '/api/media/file/';
  uploadPath: string;

  constructor(public dialogRef: MatDialogRef<UploadDialog>,
              private snackBar: SnackBarService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.uploadPath = this.uploadPathTmp + data.targetDir._id;
  }

  ngOnInit() {
  }

  onFileUploaded(event: IFileUnit) {
  }

  onAllUploaded() {
    this.dialogRef.close(true);
    this.snackBar.open('All items uploaded!');
  }

  uploadAll() {
    this.uploadForm.fileUploader.uploadAll();
    this.uploadForm.onAllUploaded.subscribe(
      result => this.onAllUploaded(),
      error => this.snackBar.open('Could not upload files')
    );
  }

  cancel() {
    this.dialogRef.close(false);
  }

  checkSave(): boolean {
    return this.uploadForm.fileUploader.queue.length !== 0;
  }
}
