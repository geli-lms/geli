import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IUser} from '../../../../../../../shared/models/IUser';
import {User} from '../../../models/User';
import {FormControl} from '@angular/forms';

import {NotificationService, UserDataService} from '../../../shared/services/data.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {IUserSearchMeta} from '../../../../../../../shared/models/IUserSearchMeta';


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
  @Input() role;

  search = '';
  userCtrl: FormControl;
  filteredStates: any;
  finishRestCall = true;
  usersTotal = 0;

  @Output() onDragendRemove = new EventEmitter<IUser>();
  @Output() onDragendPush = new EventEmitter<IUser>();
  @Output() onUpdate = new EventEmitter<String>();
  @Output() onSearch = new EventEmitter<String>();

  constructor(private dragula: DragulaService,
              private userService: UserDataService,
              private notificationService: NotificationService) {
  }

  async searchForUsers(search: string) {
    this.onSearch.emit(search);
    if (search !== '' && this.finishRestCall) {
      this.finishRestCall = false;
      const foundDatas: IUserSearchMeta = await this.userService.searchUsers(this.role, search, 20);
      const foundUsers: User[] = foundDatas.users.map(user => new User(user));
      this.usersTotal = foundDatas.meta.count;
      if (foundUsers) {
        const idList: string[] = this.course.students.map((u) => u._id);
        this.dragableUsersInCourse = foundUsers.filter(user => (idList.indexOf(user._id) >= 0
          && this.course.courseAdmin._id !== user._id));
        this.dragableUsers = foundUsers.filter(user => (idList.indexOf(user._id) < 0
          && this.course.courseAdmin._id !== user._id));
      } else {
        this.dragableUsers = [];
        this.dragableUsersInCourse = [];
      }
      this.finishRestCall = true;
    } else {
      this.finishRestCall = true;
    }
  }

  ngOnInit() {
    // Make items only draggable by dragging the handle
    this.dragula.setOptions(this.dragulaBagId, {
      moves: (el, container, handle) => {
        return handle.classList.contains('user-drag-handle');
      }
    });
    this.dragula.dropModel.subscribe(value => {
      const [bagName, el, target, source] = value;
      if (source.getAttribute('item-id') !== target.getAttribute('item-id')) {
        if (bagName === this.dragulaBagId) {
              if (target.getAttribute('item-id') === 'UserNotInCourse') {
                const idList: string[] = this.dragableUsers.map(user => user._id);
                const index: number = idList.indexOf(el.children[0].getAttribute('item-id'));
                if (index >= 0) {
                  this.notificationService.createNotification(
                    this.dragableUsers[index],
                    {targetType: 'text', text: 'You have been removed from course ' + this.course.name});
                  this.onDragendRemove.emit(this.dragableUsers[index]);
                }
              } else if (target.getAttribute('item-id') === 'UserInCourse') {
                const idList: string[] = this.dragableUsersInCourse.map(user => user._id);
                const index: number = idList.indexOf(el.children[0].getAttribute('item-id'));
                if (index >= 0) {
                  this.onDragendPush.emit(this.dragableUsersInCourse[index]);
                }
              }
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
