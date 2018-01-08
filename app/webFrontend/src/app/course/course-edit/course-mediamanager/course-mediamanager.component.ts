import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CourseMediamanagerDetailDialog} from './course-mediamanager-detail-dialog/course-mediamanager-detail.dialog';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-course-mediamanager',
  templateUrl: './course-mediamanager.component.html',
  styleUrls: ['./course-mediamanager.component.scss']
})
export class CourseMediamanagerComponent implements OnInit {
  @Input() course: ICourse;
  folderBarVisible: boolean;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.folderBarVisible = true;
  }

  toggleFolderBarVisibility(): void {
    this.folderBarVisible = !this.folderBarVisible;
  }

  openDetailDialog(): void {
    const dialogRef = this.dialog.open(CourseMediamanagerDetailDialog, {
      width: '80vw',
      // height: '94vh',
      maxWidth: '100vw',
      maxHeight: '90vh',
      data: {
        markdown: this.course
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
      // if (typeof result !== 'undefined') {
      //   this.model.markdown = result;
      // }
    // });
  }

}
