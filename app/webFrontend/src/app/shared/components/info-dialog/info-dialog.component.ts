import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialog {

  public title: string;
  public message: string;

  constructor(public dialogRef: MatDialogRef<InfoDialog>) {
  }

}
