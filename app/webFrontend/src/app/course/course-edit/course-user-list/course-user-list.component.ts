import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IUser} from '../../../../../../../shared/models/IUser';
import {FormControl} from '@angular/forms';
import {DialogService} from '../../../shared/services/dialog.service';
import 'rxjs/add/operator/startWith'
import {CourseService} from '../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-course-user-list',
  templateUrl: './course-user-list.component.html',
  styleUrls: ['./course-user-list.component.scss']
})
export class CourseUserListComponent implements OnInit, OnDestroy {

  @Input() courseId;
  @Input() usersInCourse: IUser[];
  @Input() users: IUser[];
  @Input() dragulaBagId;
  @Input() role;

  selectedMembers: IUser[] = [];
  fuzzySearch: String = '';
  userCtrl: FormControl;
  filteredStates: any;
  toggleBlocked = false;

  @Output() onDragendUpdate = new EventEmitter<IUser[]>();
  @Output() onRemove = new EventEmitter<String>();

  constructor(private dragula: DragulaService,
              public dialogService: DialogService,
              private courseService: CourseService,
              private snackBar: MatSnackBar) {
    this.userCtrl = new FormControl();
    this.filteredStates = this.userCtrl.valueChanges
    .startWith(null)
    .map(name => this.filterStates(name));
  }

  ngOnInit() {
    // Make items only draggable by dragging the handle
    this.dragula.setOptions(this.dragulaBagId, {
    moves: (el, container, handle) => {
      return handle.classList.contains('user-drag-handle') || handle.classList.contains('member-drag-handle');
    }
    });
    this.dragula.dropModel.subscribe(value => {
      const bagName = value[0];

      if (bagName === this.dragulaBagId) {
        this.onDragendUpdate.emit(this.usersInCourse);
      }
    });
  }

  ngOnDestroy() {
    this.dragula.destroy(this.dragulaBagId);
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

  isInSelectedMembers(member: IUser) {
    return this.selectedMembers.indexOf(member) !== -1;
  }

  filterStates(val: string) {
    return val ? this.users.filter(s => this.fuzzysearch(val, s))
      .map(e => e.profile.firstName + ' ' + e.profile.lastName + ' ' + e.email)
      : [];
  }

  // TODO: do levenshtein in backend
  fuzzysearch(toSearch: string, user: IUser): boolean {
    const lowerToSearch: string = toSearch.toLowerCase();
    const elementsToFind = lowerToSearch.split(' ');
    if (user.uid === undefined) {
      user.uid = '';
    }
    const resArray = elementsToFind.filter(e => user.profile.firstName.toLowerCase().includes(e) ||
      user.profile.lastName.toLowerCase().includes(e) ||
      user.email.toLowerCase().includes(e)
    );
    return resArray.length > 0;
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
