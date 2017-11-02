import {NgModule} from '@angular/core';
import {ConfirmDialog} from '../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../components/access-key-dialog/access-key-dialog.component';
import {DialogService} from '../services/dialog.service';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material';
import {UploadDialog} from '../components/upload-dialog/upload-dialog.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    MatFormFieldModule,
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
