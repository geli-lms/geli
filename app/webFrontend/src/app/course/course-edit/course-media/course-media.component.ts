import {Component, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CourseMediamanagerDetailDialog} from './course-media-detail-dialog/course-mediamanager-detail.dialog';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CourseService, MediaService} from '../../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {IDirectory} from '../../../../../../../shared/models/mediaManager/IDirectory';

@Component({
  selector: 'app-course-mediamanager',
  templateUrl: './course-media.component.html',
  styleUrls: ['./course-media.component.scss']
})
export class CourseMediaComponent implements OnInit {
  course: ICourse;
  folderBarVisible: boolean;
  currentFolder: IDirectory;

  constructor(public dialog: MatDialog,
              private mediaService: MediaService,
              private courseService: CourseService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.folderBarVisible = true;

    this.route.parent.params.subscribe(
      async (params) => {
        // retrieve course
        this.course = await this.courseService.readSingleItem<ICourse>(params['id']);

        // Check if course has root dir
        if (this.course.media === undefined) {
          // Root dir does not exist, add one
          this.course.media = await this.mediaService.createRootDir(this.course.name);
          // Update course
          const request: any = {
            '_id': this.course._id,
            'media': this.course.media,
          };
          await this.courseService.updateItem(request);
        }

        // Set root dir as current
        this.currentFolder = this.course.media;
      },
      error => {
        this.snackBar.open('Could not load course', '', {duration: 3000})
      }
    );
  }

  dataReady(): boolean {
    return this.course !== undefined && this.course.media !== undefined;
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
