import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';
import {WhitelistUserService} from '../../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-whitelist-edit',
  templateUrl: './whitelist-edit.component.html',
  styleUrls: ['./whitelist-edit.component.scss']
})
export class WhitelistEditComponent implements OnInit {

  dragableWhitelistUser: IWhitelistUser[] = [];
  dragableWhitelistUserInCourse: IWhitelistUser[] = [];
  finishRestCall = false;
  @Input() course: ICourse;
  @Input() dragulaBagId;
  @Input() total = 0;
  @Output() onDragableWhitelistUserInCourse = new EventEmitter<IWhitelistUser[]>();
  @Output() onDragendRemoveWhitelist = new EventEmitter<IWhitelistUser>();
  @Output() onDragendPushWhitelist = new EventEmitter<IWhitelistUser>();

  search = '';
  isToggled = false;
  whitelistUser: any = {firstName: '', lastName: '', uid: '', courseId: null};

  constructor(private whitelistUserService: WhitelistUserService,
              private snackBar: MatSnackBar,
              private dragula: DragulaService) {
  }

  get searchString() {
    return this.search;
  }

  @Input()
  set searchString(search: string) {
    this.search = search;
    this.finishRestCall = false;
    if (search !== '') {
      this.whitelistUserService.getAll(this.course._id).then((found) => {
        this.dragableWhitelistUser = found;
        // const idList: string[] = this.course.whitelist.map((u) => u._id);
        // this.dragableWhitelistUser = found.filter(user => (idList.indexOf(user._id) < 0));
        // this.dragableWhitelistUserInCourse = found.filter(user => (idList.indexOf(user._id) >= 0));
        // this.onDragableWhitelistUserInCourse.emit(this.dragableWhitelistUserInCourse);
        this.finishRestCall = true;
      });
    }
  }

  ngOnInit() {
/*    this.dragula.dropModel.subscribe(value => {
      const [bagName, el, target, source] = value;
      if (target.getAttribute('item-id') === 'Whitelist') {
        const idList: string[] = this.dragableWhitelistUser.map(user => user._id);
        const index: number = idList.indexOf(el.children[0].getAttribute('item-id'));
        if (index >= 0) {
          this.onDragendRemoveWhitelist.emit(this.dragableWhitelistUser[index]);
        }
      } else if (target.getAttribute('item-id') === 'WhitelistInCourse') {
        const idList: string[] = this.dragableWhitelistUserInCourse.map(user => user._id);
        const index: number = idList.indexOf(el.children[0].getAttribute('item-id'));
        if (index >= 0) {
          this.onDragendPushWhitelist.emit(this.dragableWhitelistUserInCourse[index]);
        }
      }
    })*/
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }

  createNewWhitelistUser() {
    if (this.whitelistUser.firstName === '') {
      this.snackBar.open('First name should not be empty.', '', {duration: 6000});
      return null;
    } else if (this.whitelistUser.lastName === '') {
      this.snackBar.open('Last name should not be empty.', '', {duration: 6000});
      return null;
    } else if (this.whitelistUser.uid === '' || isNaN(Number(this.whitelistUser.uid))) {
      this.snackBar.open('Unique identification should be a number and not empty', '', {duration: 6000});
      return null;
    }
    this.whitelistUser.courseId = this.course._id;
    return this.whitelistUserService.createItem(this.whitelistUser).then((newUser) => {
      this.dragableWhitelistUser.push(newUser);
      this.onDragendPushWhitelist.emit(newUser);
    });
  }
}
