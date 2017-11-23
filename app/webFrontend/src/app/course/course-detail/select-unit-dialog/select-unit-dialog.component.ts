import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-select-unit-dialog',
  templateUrl: './select-unit-dialog.component.html',
  styleUrls: ['./select-unit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectUnitDialogComponent {
  course : ICourse;

  constructor(public dialogRef: MatDialogRef<SelectUnitDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.course = data.course;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
