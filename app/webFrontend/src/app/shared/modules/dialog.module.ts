import {NgModule} from '@angular/core';
import {ConfirmDialog} from '../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../components/access-key-dialog/access-key-dialog.component';
import {DialogService} from '../services/dialog.service';
import {FormsModule} from '@angular/forms';
import {UploadDialog} from '../components/upload-dialog/upload-dialog.component';
import {WriteMailDialog} from '../components/write-mail-dialog/write-mail-dialog.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';
import {MaterialImportModule} from './material-import.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    MaterialImportModule,
  ],
  exports: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    WriteMailDialog,
  ],
  declarations: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    WriteMailDialog,
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    WriteMailDialog,
  ]
})
export class DialogModule {
}
