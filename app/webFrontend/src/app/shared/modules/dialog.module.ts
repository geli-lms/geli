import {NgModule} from '@angular/core';
import {ConfirmDialog} from '../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../components/access-key-dialog/access-key-dialog.component';
import {FilepickerDialog} from '../components/filepicker-dialog/filepicker-dialog.component';
import {DialogService} from '../services/dialog.service';
import {FormsModule} from '@angular/forms';
import {UploadDialog} from '../components/upload-dialog/upload-dialog.component';
import {WriteMailDialog} from '../components/write-mail-dialog/write-mail-dialog.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';
import {MaterialImportModule} from './material-import.module';
import {AceEditorModule} from 'ng2-ace-editor';
import {InfoDialog} from '../components/info-dialog/info-dialog.component';
import {FocusDirective} from '../directives/focus.directive';
import {RenameDialogComponent} from '../components/rename-dialog/rename-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    MaterialImportModule,
    AceEditorModule,
  ],
  exports: [
    InfoDialog,
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
    WriteMailDialog,
    RenameDialogComponent,
    FocusDirective,
  ],
  declarations: [
    InfoDialog,
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
    WriteMailDialog,
    RenameDialogComponent,
    FocusDirective,
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    InfoDialog,
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
    RenameDialogComponent,
    WriteMailDialog,
  ]
})
export class DialogModule {
}
