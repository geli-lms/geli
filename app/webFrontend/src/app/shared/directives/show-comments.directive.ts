import {Directive, HostListener, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CommentsDialogComponent} from '../../messaging/comments-dialog/comments-dialog.component';


@Directive({
  selector: '[appShowComments]'
})
export class ShowCommentsDirective {

  @Input() room: string;
  @Input() title: string;

  constructor(private dialog: MatDialog) {
  }

  @HostListener('click') onClick() {
    console.log(this.room, this.title)
    const dialogRef = this.dialog.open(CommentsDialogComponent
      , {
      data: {
        room: this.room,
        title: this.title
      },
      panelClass: 'comments-dialog'
    });
  }

}
