import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-unit-selector',
  templateUrl: './unit-selector.component.html',
  styleUrls: ['./unit-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitSelectorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UnitSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {




  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
