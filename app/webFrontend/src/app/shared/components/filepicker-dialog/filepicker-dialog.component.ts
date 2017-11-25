import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-filepicker-dialog',
  templateUrl: './filepicker-dialog.component.html',
  styleUrls: ['./filepicker-dialog.component.css']
})
export class FilepickerDialog {

  public message: string;
  public choosenFile: any;

  constructor(public dialogRef: MatDialogRef<FilepickerDialog>) {
  }

  private fileChange(file: any) {
    console.log(file);
    this.choosenFile = file;
  }

  close(success: boolean) {
    return this.dialogRef.close({success, file: this.choosenFile});
  }

}
