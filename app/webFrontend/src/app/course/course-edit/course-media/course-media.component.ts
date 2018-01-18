import {Component, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CourseService, MediaService} from '../../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {IDirectory} from '../../../../../../../shared/models/mediaManager/IDirectory';
import {UploadFormDialog} from '../../../shared/components/upload-form-dialog/upload-form-dialog.component';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';
import {DialogService} from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-course-mediamanager',
  templateUrl: './course-media.component.html',
  styleUrls: ['./course-media.component.scss']
})
export class CourseMediaComponent implements OnInit {
  course: ICourse;
  folderBarVisible: boolean;
  currentFolder: IDirectory;
  selectedFiles: IFile[] = [];
  toggleBlocked = false;

  constructor(public dialog: MatDialog,
              private mediaService: MediaService,
              public dialogService: DialogService,
              private courseService: CourseService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.folderBarVisible = false;

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

        this.course.media = await this.mediaService.getDirectory(this.course.media._id, true);

        // Set root dir as current
        this.currentFolder = this.course.media;
        console.log(this.course.media);
      },
      error => {
        this.snackBar.open('Could not load course', '', {duration: 3000})
      }
    );
  }

  toggleFolderBarVisibility(): void {
    this.folderBarVisible = !this.folderBarVisible;
  }

  addFile(): void {
    // TODO: Dialog can grow to high; implement scroll
    const dialogRef = this.dialog.open(UploadFormDialog, {
      maxHeight: '90vh',
      minWidth: '50vw',
      data: {
        targetDir: this.currentFolder,
      },
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        // TODO: Reload folder content
        console.log('Reload site, folder not yet updated');
      }
    });
  }

  isInSelectedFiles(file: IFile) {
    return this.selectedFiles.indexOf(file) !== -1;
  }

  toggleSelection(file: IFile) {
    if (this.toggleBlocked) {
      return;
    }
    const position = this.selectedFiles.indexOf(file);
    if (position !== -1) {
      this.selectedFiles.splice(position, 1);
    } else {
      this.selectedFiles.push(file);
    }
  }

  async removeSelectedFile() {
    this.toggleBlocked = true;
    const res = await this.dialogService
      .confirmRemove('selected files', '', 'course')
      .toPromise();
    this.toggleBlocked = false;
    if (res) {
      this.selectedFiles.forEach(file => console.log('TODO: Remove file', file));
      this.selectedFiles = [];
    }
  }

  initFileDownload(file: IFile) {
    // FIXME: REMOVE split/pop when physical path holds correct value
    const url = '/api/uploads/' + file.physicalPath.split('/').pop();
    window.open(url, '_blank');
    this.toggleSelection(file);
  }

  renameFile(file: IFile) {

  }
}
