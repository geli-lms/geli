import {Component, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CourseService, MediaService} from '../../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {IDirectory} from '../../../../../../../shared/models/mediaManager/IDirectory';
import {UploadFormDialog} from '../../../shared/components/upload-form-dialog/upload-form-dialog.component';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';
import {DialogService} from '../../../shared/services/dialog.service';
import {RenameDialogComponent} from '../../../shared/components/rename-dialog/rename-dialog.component';

const prettyBytes = require('pretty-bytes');

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
          await this.courseService.updateItem<ICourse>(this.course);
          // Reload course
          this.course = await this.courseService.readSingleItem<ICourse>(this.course._id);
        }

        await this.changeDirectory(this.course.media._id, true);
      },
      error => {
        this.snackBar.open('Could not load course', '', {duration: 3000})
      }
    );
  }

  async reloadDirectory() {
    await this.changeDirectory(this.currentFolder._id, true);
  }

  async changeDirectory(mediaId: string, lazy: boolean = false) {
    // Set current dir
    this.currentFolder = await this.mediaService.getDirectory(mediaId, lazy);

    // Define Sort function to sort by name
    const sortFnc = (a, b): number => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (aName < bName) {
        return -1;
      } else if (aName > bName) {
        return 1;
      }
      return 0;
    };

    // Sort files by name
    this.currentFolder.files.sort(sortFnc);

    // Sort subdirs by name
    this.currentFolder.subDirectories.sort(sortFnc);
  }

  bytesHumanReadable(bytes: number): string {
    return prettyBytes(bytes);
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
        // Reload current folder
        this.reloadDirectory();
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
      let failed = false;
      this.selectedFiles.forEach(async file => {
        await this.mediaService.deleteFile(file)
          .catch(reason => {
            this.snackBar.open('Could not remove file: ' + file.name, '', {duration: 2000});
            failed = true;
          });
      });
      if (!failed) {
        this.snackBar.open('Removed all selected files', '', {duration: 3000});
      }
      this.selectedFiles = [];
      await this.reloadDirectory();
    }
  }

  initFileDownload(file: IFile) {
    const url = '/api/uploads/' + file.link;
    window.open(url, '_blank');
    this.toggleSelection(file);
  }

  async renameFile(file: IFile) {
    const res = await this.dialog.open(RenameDialogComponent, {
      minWidth: '30%',
      data: {
        name: file.name,
      }
    });

    res.afterClosed().subscribe(async value => {
      if (value !== false) {
        // Update file attributes
        file.name = value;
        await this.mediaService.updateFile(file)
          .then(value2 => this.snackBar.open('Renamed file', '', {duration: 2000}))
          .catch(reason => this.snackBar.open('Rename failed, Server error', '', {duration: 2000}));
        await this.reloadDirectory();
      }
    });
  }

  getSimpleMimeType(file: IFile): string {
    const mimeType = file.mimeType.toLowerCase();
    const archives = [
      'application/x-bzip',
      'application/x-bzip2',
      'application/x-rar-compressed',
      'application/x-tar',
      'application/x-zip-compressed',
      'application/zip',
      'application/x-7z-compressed',
    ];

    if (mimeType.startsWith('video')) {
      return 'video';
    } else if (mimeType.startsWith('image')) {
      return 'image';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (archives.indexOf(mimeType) >= 0) {
      return 'archive';
    } else if (mimeType.startsWith('text')) {
      return 'text';
    } else {
      return 'unknown';
    }
  }
}
