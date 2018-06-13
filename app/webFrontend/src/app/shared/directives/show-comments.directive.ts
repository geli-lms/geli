import {Directive, HostListener, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CommentsDialogComponent} from '../../messaging/comments-dialog/comments-dialog.component';


@Directive({
  selector: '[appShowComments]'
})
export class ShowCommentsDirective {

  @Input() room: string;

  constructor(private dialog: MatDialog) {
  }

  @HostListener('click') onClick() {
    let dialogRef = this.dialog.open(CommentsDialogComponent
      , {
      data: {
        room: this.room
      },
      panelClass: 'comments-dialog'
    })
  }

}
