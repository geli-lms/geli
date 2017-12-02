import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUser} from '../../../../../../../../shared/models/IUser';
import {DialogService} from '../../../../shared/services/dialog.service';
import {MatSnackBar} from '@angular/material';
import {CourseService} from '../../../../shared/services/data.service';

@Component({
  selector: 'app-course-user-list-overview',
  templateUrl: './course-user-list-overview.component.html',
  styleUrls: ['./course-user-list-overview.component.scss']
})
export class CourseUserListOverviewComponent implements OnInit {

  @Input() usersInCourse: IUser[];
  @Input() show: boolean;
  @Output() onRemove = new EventEmitter<String>();

  selectedMembers: IUser[] = [];
  toggleBlocked = false;

  constructor(private dialogService: DialogService, private snackBar: MatSnackBar,
              private courseService: CourseService) {
  }

  ngOnInit() {
  }

  isInSelectedMembers(member: IUser) {
    return this.selectedMembers.indexOf(member) !== -1;
  }

  toggleMember(member: IUser) {
    if (this.toggleBlocked) {
      return;
    }
    const position = this.selectedMembers.indexOf(member);
    if (position !== -1) {
      this.selectedMembers.splice(position, 1);
    } else {
      this.selectedMembers.push(member);
    }
  }

  async removeSelectedUsers() {
    this.toggleBlocked = true;
    const res = await this.dialogService
      .confirmRemove('selected members', '', 'course')
      .toPromise();
    this.toggleBlocked = false;
    if (res) {
      this.selectedMembers.forEach(user => this.onRemove.emit(user._id));
      this.selectedMembers = [];
    }
  }

  async openWriteMailDialog() {
    this.toggleBlocked = true;
    const mailData = await this.dialogService.writeMail(
      this.selectedMembers
        .map((user: IUser) => `${user.profile.firstName} ${user.profile.lastName}<${user.email}>`)
        .join(', ')
    ).toPromise();
    this.toggleBlocked = false;
    if (!mailData) {
      return;
    }
    this.selectedMembers = [];
    try {
      await this.courseService.sendMailToSelectedUsers(mailData);
      this.snackBar.open('Sending mail succeeded.', '', {duration: 2000});
    } catch (err) {
      this.snackBar.open('Sending mail failed.', '', {duration: 3000});
    }
  }
}
