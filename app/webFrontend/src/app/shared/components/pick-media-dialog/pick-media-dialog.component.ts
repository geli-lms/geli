import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList, MatSnackBar} from '@angular/material';
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

  constructor(private dialogRef: MatDialogRef<PickMediaDialog>,
              private mediaService: MediaService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  async ngOnInit() {
    if (this.data.directoryId) {
      this.directory = await this.mediaService.getDirectory(this.data.directoryId, true);
      this.allFiles = this.directory.files;
    } else {
      this.dialogRef.close(false);
    }
  }

  save(): void {
    if (this.fileList.selectedOptions.selected.length === 0) {
      this.snackBar.open('Please choose at least one file', '', {duration: 2000});
      return;
    }

    this.dialogRef.close(this.fileList.selectedOptions.selected);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
