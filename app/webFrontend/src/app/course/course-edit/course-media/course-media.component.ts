import {Component, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CourseMediamanagerDetailDialog} from './course-media-detail-dialog/course-mediamanager-detail.dialog';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CourseService, MediaService} from '../../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-course-mediamanager',
  templateUrl: './course-media.component.html',
  styleUrls: ['./course-media.component.scss']
})
export class CourseMediaComponent implements OnInit {
  course: ICourse;
  folderBarVisible: boolean;

  constructor(public dialog: MatDialog,
              private mediaService: MediaService,
              private courseService: CourseService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.folderBarVisible = true;

    this.route.params.subscribe(params => {
        console.log(params);
        const courseId = params['id'];
        // this.courseService.readSingleItem(courseId)
        //   .then(course => {
        //     console.log(course);
        //   });
      },
      error => {
      },

    );
    // console.log(this.course);
    // if (this.course.media === null) {
    //   // Root dir does not exist, add one
    //   this.mediaService.createRootDir(this.course.name)
    //     .then(value => {
    //       this.course.media = value;
    //       console.log(this.course);
    //       this.courseService.updateItem(this.course)
    //         .catch(reason =>
    //           this.snackBar.open('Applying root-dir to course failed', '', {duration: 3000})
    //         );
    //     })
    //     .catch(reason =>
    //       this.snackBar.open('Creating root-dir failed', '', {duration: 3000})
    //     );
    // }
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
