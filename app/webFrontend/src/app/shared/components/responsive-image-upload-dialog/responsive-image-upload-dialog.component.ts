import {Component, Input} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {IResponsiveImageData} from '../../../../../../../shared/models/IResponsiveImageData';

@Component({
  selector: 'app-responsive-image-upload-dialog',
  templateUrl: '../filepicker-dialog/filepicker-dialog.component.html',
  styleUrls: ['../filepicker-dialog/filepicker-dialog.component.scss']
})
export class ResponsiveImageUploadDialog {

  public message: string;
  public uploadPath: string;

  public uploader: FileUploader;
  showProgressBar = false;

  responsiveImageData: IResponsiveImageData;

  constructor(public dialogRef: MatDialogRef<ResponsiveImageUploadDialog>) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.uploadPath
    });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      return this.dialogRef.close({success: status === 200, result: JSON.parse(response)});
    };
    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      return this.dialogRef.close({success: false, result: JSON.parse(response)});
    };
  }

  public setResponsiveImageData(responsiveImageData: IResponsiveImageData) {
    this.responsiveImageData = responsiveImageData;
  }

  public upload() {
    this.dialogRef.disableClose = true;
    this.showProgressBar = true;

    if (this.responsiveImageData) {
      // Append the breakpoints to the upload form.
      this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('imageData', JSON.stringify(this.responsiveImageData));
      };
    }

    this.uploader.uploadAll();
  }

  public cancel() {
    this.uploader.cancelAll();
    this.dialogRef.close({success: false});
  }

}
