import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
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

  uploadPath: string;
  allowedMimeTypes: string[];

  constructor(public dialogRef: MatDialogRef<UploadDialog>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.uploadPath = data.targetDir;


  }

  ngOnInit() {
  }

  onFileUploaded(event: IFileUnit) {
  }

  onAllUploaded() {
    this.dialogRef.close(true);
  }

  uploadAll() {
    this.uploadForm.fileUploader.uploadAll();
    this.uploadForm.onAllUploaded.subscribe(
      result =>
        this.onAllUploaded()
      , error =>
        this.snackBar.open('Could not upload files', '', {duration: 3000})
    );
  }

  cancel() {
    this.dialogRef.close(false);
  }

  checkSave(): boolean {
    return this.uploadForm.fileUploader.queue.length !== 0;
  }
}
