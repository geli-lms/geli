import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-course-mediamanager-detail.dialog',
  templateUrl: './course-mediamanager-detail.dialog.html',
  styleUrls: ['./course-mediamanager-detail.dialog.scss']
})
export class CourseMediamanagerDetailDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<CourseMediamanagerDetailDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onCloseClick(): any {
    return this.dialogRef.close();
  }
}
