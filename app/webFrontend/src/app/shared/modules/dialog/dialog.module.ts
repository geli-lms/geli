import { NgModule } from '@angular/core';
import {ConfirmDialog} from '../../components/delete-dialog/confirm-dialog.component';
import {DialogService} from '../../services/dialog.service';

@NgModule({
  imports: [
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
