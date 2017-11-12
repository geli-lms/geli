import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IUser} from '../../../../../../../shared/models/IUser';
import {FormControl} from '@angular/forms';
import {DialogService} from '../../../shared/services/dialog.service';
import 'rxjs/add/operator/startWith'
import {UserService} from '../../../shared/services/user.service';
import {UserDataService} from '../../../shared/services/data.service';

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

  currentMember: IUser = null;
  search = '';
  userCtrl: FormControl;
  filteredStates: any;

  set searchString(search: string) {
    if (search !== '') {
      console.log('Set ' + search);
      this.userService.searchUsers(this.role, search).then( (found) => {
        if (found) {
          const idList: string[] = this.usersInCourse.map((u) => u._id);
          this.users = found.filter(user => idList.includes(user.id));
        } else {
          this.users = [];
        }
      });
      this.search = search;
    } else {
      this.search = search;
    }
  }

  get searchString(): string {
    return this.search;
  }


  @Output() onDragendUpdate = new EventEmitter<IUser[]>();
  @Output() onUpdate = new EventEmitter<String>();

  setMember(member: IUser) {
    this.currentMember = member;
  }

  constructor(private dragula: DragulaService,
              private userService: UserDataService,
              public dialogService: DialogService) {
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
    this.userCtrl = new FormControl();
    this.filteredStates = this.userCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterStates(name));
  }

  ngOnDestroy() {
    this.dragula.destroy(this.dragulaBagId);
  }

  filterStates(val: string) {
    // TODO Call userService or read from foundUsers.
    return val ? this.users.filter(s => this.searchUsers(val, s))
        .map(e => e.profile.firstName + ' ' + e.profile.lastName + ' ' + e.email)
      : [];
  }

  searchUsers(toSearch: string, user: IUser): boolean {
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

  updateUser() {
    this.dialogService
      .confirmRemove(this.currentMember.role, this.currentMember.email, 'course')
      .subscribe(res => {
        if (res) {
          this.onUpdate.emit(this.currentMember._id);
        }
      });
  }
}
