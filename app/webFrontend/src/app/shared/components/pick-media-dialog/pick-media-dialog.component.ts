import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList} from '@angular/material';
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

  constructor(private dialogref: MatDialogRef<PickMediaDialog>,
              private mediaService: MediaService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  async ngOnInit() {
    if (this.data.directoryId) {
      this.directory = await this.mediaService.getDirectory(this.data.directoryId, true);
      this.allFiles = this.directory.files;
    } else {
      this.dialogref.close(false);
    }
  }

  save(): void {
    console.log(this.fileList.selectedOptions);
    console.log(this.fileList.selectedOptions.selected);
    console.log(this.fileList.selectedOptions.selected.values());
    console.log(this.fileList.selectedOptions.selected.pop());
    this.dialogref.close(this.fileList.selectedOptions);
  }

  cancel(): void {
    this.dialogref.close(false);
  }

}
