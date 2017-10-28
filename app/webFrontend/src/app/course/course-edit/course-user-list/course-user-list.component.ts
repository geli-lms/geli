import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IUser} from '../../../../../../../shared/models/IUser';
import {FormControl} from '@angular/forms';
import {DialogService} from '../../../shared/services/dialog.service';

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

  currentMember: IUser = null;
  fuzzySearch: String = '';
  userCtrl: FormControl;
  filteredStates: any;

  @Output() onDragendUpdate = new EventEmitter<IUser[]>();
  @Output() onRemove = new EventEmitter<String>();

  setMember(member: IUser) {
    this.currentMember = member;
  }

  constructor(private dragula: DragulaService,
              public dialogService: DialogService) {
    this.userCtrl = new FormControl();
    this.filteredStates = this.userCtrl.valueChanges
    .startWith(null)
    .map(name => this.filterStates(name));
  }

  ngOnInit() {
    this.dragula.setOptions(this.dragulaBagId, {
      revertOnSpill: true
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

  removeUser() {
    this.dialogService
      .confirmRemove(this.currentMember.role, this.currentMember.email, 'course')
      .subscribe(res => {
        if (res) {
          this.onRemove.emit(this.currentMember._id);
        }
      });
  }
}
