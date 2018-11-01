import {Component, Input} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';

@Component({
  selector: 'app-filepicker-dialog',
  templateUrl: './filepicker-dialog.component.html',
  styleUrls: ['./filepicker-dialog.component.scss']
})
export class FilepickerDialog {

  public message: string;
  public uploadPath: string;

  public uploader: FileUploader;
  showProgressBar = false;

  constructor(public dialogRef: MatDialogRef<FilepickerDialog>) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.uploadPath
    });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      return this.dialogRef.close({success: (status === 200) ? true : false, result: JSON.parse(response)});
    };
    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      return this.dialogRef.close({success: false, result: JSON.parse(response)});
    };
  }

  public upload() {
    this.dialogRef.disableClose = true;
    this.showProgressBar = true;
    this.uploader.uploadAll();
  }

  public cancel() {
    this.uploader.cancelAll();
    this.dialogRef.close({success: false});
  }

}
