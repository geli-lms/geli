import {NgModule} from '@angular/core';
import {MaterialModule} from '@angular/material';
import {ConfirmDialog} from '../../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../../components/access-key-dialog/access-key-dialog.component';
import {DialogService} from '../../services/dialog.service';
import {FormsModule} from '@angular/forms';
import {UploadDialog} from '../../components/upload-dialog/upload-dialog.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FileUploadModule
  ],
  exports: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
  ],
  declarations: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog
  ]
})
export class DialogModule {
}
