import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-unit-selector',
  templateUrl: './unit-selector.component.html',
  styleUrls: ['./unit-selector.component.scss']
})
export class UnitSelectorComponent {

  constructor(public dialogRef: MatDialogRef<UnitSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {




  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
