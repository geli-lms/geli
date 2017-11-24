import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IUser} from '../../../../../../../shared/models/IUser';
import {User} from '../../../models/User';
import {FormControl} from '@angular/forms';
import {DialogService} from '../../../shared/services/dialog.service';
import 'rxjs/add/operator/startWith'
import {UserDataService} from '../../../shared/services/data.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-course-user-list',
  templateUrl: './course-user-list.component.html',
  styleUrls: ['./course-user-list.component.scss']
})
export class CourseUserListComponent implements OnInit, OnDestroy {

  @Input() courseId;
  @Input() course: ICourse;
  @Input() dragableUsersInCourse: User[] = [];
  @Input() dragableUsers: User[] = [];
  @Input() users: User[] = [];
  @Input() dragulaBagId;
  @Input() role;
  @Input() usersTotal = 0;

  @Output() onDragendUpdate = new EventEmitter<IUser>();
  @Output() onUpdate = new EventEmitter<String>();
  @Output() onSearch = new EventEmitter<String>();

  search = '';
  userCtrl: FormControl;
  filteredStates: any;
  finishRestCall = false;
  fieldsToShow = new Map<string, boolean>();

  set searchString(search: string) {
    this.search = search;
    this.onSearch.emit(search);
    this.finishRestCall = false;
    if (search !== '') {
      this.userService.searchUsers(this.role, search).then((found) => {
        if (found) {
          const idList: string[] = this.dragableUsersInCourse.map((u) => u._id);
          this.dragableUsers = found.filter(user => (idList.indexOf(user._id) < 0
            && this.course.courseAdmin._id !== user._id)).map(data => new User(data));
          this.dragableUsersInCourse = found.filter(user => (idList.indexOf(user._id) >= 0
            && this.course.courseAdmin._id !== user._id)).map(data => new User(data));
        } else {
          this.dragableUsers = [];
          this.dragableUsersInCourse = [];
        }
        this.finishRestCall = true;
      });
    }
  }

  get searchString(): string {
    return this.search;
  }

  constructor(private dragula: DragulaService,
              private userService: UserDataService) {
  }


  ngOnInit() {
    const idList: string[] = this.dragableUsersInCourse.map((u) => u._id);
    this.users = this.users.filter(user => this.course.courseAdmin._id !== user._id);
    // Make items only draggable by dragging the handle
    this.dragula.setOptions(this.dragulaBagId, {
      moves: (el, container, handle) => {
        return handle.classList.contains('user-drag-handle') || handle.classList.contains('member-drag-handle');
      }
    });
    this.dragula.dropModel.subscribe(value => {
      const [bagName, el, target, source] = value;
      const draggedUser: IUser = this.dragableUsers.concat(this.dragableUsersInCourse)
        .find((user: IUser) => user._id === el.children[0].getAttribute('item-id'));
      if (bagName === this.dragulaBagId) {
        this.onDragendUpdate.emit(draggedUser);
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

  toggle(name: string) {
    if (this.fieldsToShow.get(name)) {
      this.fieldsToShow.set(name, false);
    } else {
      this.fieldsToShow.set(name, true);
    }
  }

  filterStates(val: string) {
    return val ? this.dragableUsers.concat(this.dragableUsersInCourse)
        .map(e => e.profile.firstName + ' ' + e.profile.lastName + ' ' + e.email)
        .slice(0, 3)
      : [];
  }

  updateUser(id: string) {
    this.onUpdate.emit(id);
  }
}
