import {NgModule} from '@angular/core';
import {ConfirmDialog} from '../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../components/access-key-dialog/access-key-dialog.component';
import {FilepickerDialog} from '../components/filepicker-dialog/filepicker-dialog.component';
import {DialogService} from '../services/dialog.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UploadDialog} from '../components/upload-dialog/upload-dialog.component';
import {WriteMailDialog} from '../components/write-mail-dialog/write-mail-dialog.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';
import {MaterialImportModule} from './material-import.module';
import {AceEditorModule} from 'ng2-ace-editor';
import {InfoDialog} from '../components/info-dialog/info-dialog.component';
import {FocusDirective} from '../directives/focus.directive';
import {ChangePasswordDialogComponent} from '../components/change-password-dialog/change-password-dialog.component';
import {RenameDialogComponent} from '../components/rename-dialog/rename-dialog.component';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportModule,
    HttpClientModule,
    FileUploadModule,
    TranslateModule,
    AceEditorModule,
  ],
  exports: [
    InfoDialog,
    ConfirmDialog,
    TranslateModule,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
    WriteMailDialog,
    RenameDialogComponent,
    FocusDirective,
    MaterialImportModule
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
    ChangePasswordDialogComponent,
  ]
})
export class DialogModule {
}
