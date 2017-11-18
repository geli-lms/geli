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
  @Input() dragableUsersInCourse: IUser[];
  @Input() dragableUsers: IUser[];
  @Input() dragulaBagId;
  @Input() role;

  currentUser: IUser = null;
  search = '';
  userCtrl: FormControl;
  filteredStates: any;

  set searchString(search: string) {
    if (search !== '') {
      this.userService.searchUsers(this.role, search).then( (found) => {
        if (found) {
          const idList: string[] = this.dragableUsersInCourse.map((u) => u._id);
          this.dragableUsers = found.filter(user => idList.indexOf(user._id) >= 0);
        } else {
          this.dragableUsers = [];
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

  setCurrentUser(user: IUser) {
    this.currentUser = user;
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
        this.onDragendUpdate.emit(this.dragableUsersInCourse);
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
    return val ? this.dragableUsers.filter(s => this.searchUsers(val, s))
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

  removeUser() {
    this.dialogService
      .confirmRemove(this.currentUser.role, this.currentUser.email, 'course')
      .subscribe(res => {
        if (res) {
          this.onUpdate.emit(this.currentUser._id);
        }
      });
  }
}
