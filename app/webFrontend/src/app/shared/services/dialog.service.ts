import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialog} from '../components/confirm-dialog/confirm-dialog.component';
import {IUser} from '../../../../../../shared/models/IUser';
import {UploadDialog} from '../components/upload-dialog/upload-dialog.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) {
  }

  public confirm(title: string, message: string, confirmText: string = 'Confirm'): Observable<boolean> {
    let dialogRef: MatDialogRef<ConfirmDialog>;

    dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.confirmText = confirmText;

    return dialogRef.afterClosed();
  }

  private confirmOperation(op: string, itemType: string, itemName: string, opFrom?: string): Observable<boolean> {
    let message = 'Are you sure you want to ' + op.toLowerCase() + ' the ' + itemType + ' ' + itemName;
    if (opFrom) {
      message += ' from this ' + opFrom;
    }
    message += '?';
    return this.confirm(op + ' ' + itemType, message, op);
  }

  public confirmDelete(itemType: string, itemName, removeFrom?: string): Observable<boolean> {
    return this.confirmOperation('Delete ', itemType, itemName, removeFrom);
  }

  public confirmRemove(itemType: string, itemName: string, removeFrom?: string): Observable<boolean> {
    return this.confirmOperation('Remove', itemType, itemName, removeFrom);
  }

  public upload(user: IUser) {
    let dialogRef: MatDialogRef<UploadDialog>;

    dialogRef = this.dialog.open(UploadDialog);
    dialogRef.componentInstance.user = user;

    return dialogRef.afterClosed();
  }
}
