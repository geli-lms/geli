import { NgModule } from '@angular/core';
import {ConfirmDialog} from '../components/delete-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../components/access-key-dialog/access-key-dialog.component';
import {DialogService} from '../services/dialog.service';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material';

@NgModule({
  imports: [
    FormsModule,
    MatFormFieldModule,
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
export class DialogModule { }
