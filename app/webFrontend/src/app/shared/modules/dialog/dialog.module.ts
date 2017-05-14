import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import {ConfirmDialog} from '../../components/delete-dialog/confirm-dialog.component';
import {DialogService} from '../../services/dialog.service';

@NgModule({
  imports: [
    MaterialModule
  ],
  exports: [
    ConfirmDialog
  ],
  declarations: [
    ConfirmDialog
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    ConfirmDialog
  ]
})
export class DialogModule { }
