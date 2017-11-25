import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IUser} from '../../../../../../../shared/models/IUser';
import {User} from '../../../models/User';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/startWith'
import {UserDataService, WhitelistUserService} from '../../../shared/services/data.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {IWhitelistUser} from '../../../../../../../shared/models/IWhitelistUser';

@Component({
  selector: 'app-course-user-list',
  templateUrl: './course-user-list.component.html',
  styleUrls: ['./course-user-list.component.scss']
})
export class CourseUserListComponent implements OnInit, OnDestroy {

  @Input() course: ICourse;
  @Input() users: User[] = [];
  @Input() dragableUsersInCourse: User[] = [];
  @Input() dragableUsers: User[] = [];
  @Input() dragulaBagId;
  @Input() dragulaWhitelistBagId;
  @Input() role;
  @Input() usersTotal = 0;

  @Output() onDragendRemove = new EventEmitter<IUser>();
  @Output() onDragendPush = new EventEmitter<IUser>();
  @Output() onDragendRemoveWhitelist = new EventEmitter<IWhitelistUser>();
  @Output() onDragendPushWhitelist = new EventEmitter<IWhitelistUser>();
  @Output() onUpdate = new EventEmitter<String>();
  @Output() onSearch = new EventEmitter<String>();

  search = '';
  userCtrl: FormControl;
  filteredStates: any;
  finishRestCall = true;
  fieldsToShow = new Map<string, boolean>();
  dragableWhitelistUser: IWhitelistUser[] = [];

  constructor(private dragula: DragulaService,
              private userService: UserDataService,
              private whitelistUserService: WhitelistUserService) {
  }

  get searchString(): string {
    return this.search;
  }

  set searchString(search: string) {
    this.search = search;
    this.onSearch.emit(search);
    this.finishRestCall = false;
    if (search !== '') {
      this.userService.searchUsers(this.role, search).then((found) => {
        if (found) {
          const idList: string[] = this.dragableUsersInCourse.map((u) => u._id);
          this.dragableUsers = found.filter(user => (idList.indexOf(user._id) < 0
            && this.course.courseAdmin._id !== user._id));
          this.dragableUsersInCourse = found.filter(user => (idList.indexOf(user._id) >= 0
            && this.course.courseAdmin._id !== user._id));
        } else {
          this.dragableUsers = [];
          this.dragableUsersInCourse = [];
        }
        this.whitelistUserService.searchWhitelistUsers(this.course._id, search).then((foundWhitelistUser) => {
          const idList: string[] = this.course.whitelist.map((u) => u._id);
          this.dragableWhitelistUser = foundWhitelistUser.filter(user => (idList.indexOf(user._id) >= 0));
          this.finishRestCall = true;
        });
      });
    } else {
      this.finishRestCall = true;
    }
  }

  ngOnInit() {
    const idList: string[] = this.dragableUsersInCourse.map((u) => u._id);
    // Make items only draggable by dragging the handle
    this.dragula.setOptions(this.dragulaBagId, {
      moves: (el, container, handle) => {
        return handle.classList.contains('user-drag-handle');
      }
    });
    // Make items only draggable by dragging the handle
    this.dragula.setOptions(this.dragulaWhitelistBagId, {
      moves: (el, container, handle) => {
        return handle.classList.contains('user-drag-handle');
      }
    });
    this.dragula.dropModel.subscribe(value => {
      const [bagName, el, target, source] = value;
      if (source.getAttribute('item-id') !== target.getAttribute('item-id')) {
        if (bagName === this.dragulaBagId) {
          this.userService.readSingleItem(el.children[0].getAttribute('item-id'))
            .then((draggedUser: IUser) => {
              if (target.getAttribute('item-id') === 'UserNotInCourse') {
                this.onDragendRemove.emit(draggedUser);
              } else if (target.getAttribute('item-id') === 'UserInCourse') {
                this.onDragendPush.emit(draggedUser);
              }
            });
        }

        if (bagName === this.dragulaWhitelistBagId) {
          this.whitelistUserService.readSingleItem(el.children[0].getAttribute('item-id'))
            .then((draggedWhitelistUser: IWhitelistUser) => {
              if (target.getAttribute('item-id') === 'Whitelist') {
                this.onDragendRemoveWhitelist.emit(draggedWhitelistUser);
              } else if (target.getAttribute('item-id') === 'WhitelistInCourse') {
                this.onDragendPushWhitelist.emit(draggedWhitelistUser);
              }
            });
        }
      }
    });
    this.userCtrl = new FormControl();
    this.filteredStates = this.userCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterStates(name));
  }

  ngOnDestroy() {
    this.dragula.destroy(this.dragulaBagId);
    this.dragula.destroy(this.dragulaWhitelistBagId);
  }

  toggle(name: string) {
    if (this.fieldsToShow.get(name)) {
      this.fieldsToShow.set(name, false);
    } else {
      this.fieldsToShow.set(name, true);
    }
  }

  filterStates(val: string) {
    return val ? this.dragableUsers.concat(this.dragableUsersInCourse)
        .map(e =>
          e.profile.firstName + ' ' + e.profile.lastName + ' ' + e.email)
        .slice(0, 3)
      : [];
  }

  updateUser(id: string) {
    this.onUpdate.emit(id);
  }
}
