import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialog {

  public title: string;
  public message: string;

  constructor(public dialogRef: MdDialogRef<InfoDialog>) {
  }

}
