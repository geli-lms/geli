import {Directive, HostListener, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CommentsDialogComponent} from '../components/comments-dialog/comments-dialog.component';

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
      height: '800px',
      width: '700px',
      data: {
        room: this.room,
      }
    })
  }

}
