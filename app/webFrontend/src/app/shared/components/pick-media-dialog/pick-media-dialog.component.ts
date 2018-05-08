import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList} from '@angular/material';
import {SnackBarService} from '../../services/snack-bar.service';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';
import {IDirectory} from '../../../../../../../shared/models/mediaManager/IDirectory';
import {MediaService} from '../../services/data.service';

@Component({
  selector: 'app-pick-media-dialog',
  templateUrl: './pick-media-dialog.component.html',
  styleUrls: ['./pick-media-dialog.component.scss']
})
export class PickMediaDialog implements OnInit {

  directory: IDirectory;
  allFiles: IFile[];
  @ViewChild('fileList') fileList: MatSelectionList;
  selectedOptions: IFile[] = [];
  allowedMimeTypes: string[];

  constructor(private dialogRef: MatDialogRef<PickMediaDialog>,
              private mediaService: MediaService,
              private snackBar: SnackBarService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  async ngOnInit() {
    if (this.data.directoryId) {
      this.directory = await this.mediaService.getDirectory(this.data.directoryId, true);
      this.allFiles = this.directory.files;
    } else {
      this.dialogRef.close(false);
    }

    if (this.data.allowedMimeTypes) {
      this.allowedMimeTypes = this.data.allowedMimeTypes;
    }
  }

  save(): void {
    if (this.selectedOptions.length === 0) {
      this.snackBar.open('Please choose at least one file');
      return;
    }

    this.dialogRef.close(this.selectedOptions);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
