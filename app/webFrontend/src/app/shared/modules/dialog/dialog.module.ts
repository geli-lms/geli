import {NgModule} from '@angular/core';
import {MaterialModule} from '@angular/material';
import {ConfirmDialog} from '../../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../../components/access-key-dialog/access-key-dialog.component';
import {DialogService} from '../../services/dialog.service';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    MaterialModule,
    FormsModule
  ],
  exports: [
    ConfirmDialog,
    AccessKeyDialog
  ],
  declarations: [
    ConfirmDialog,
    AccessKeyDialog
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    ConfirmDialog,
    AccessKeyDialog
  ]
})
export class DialogModule {
}
