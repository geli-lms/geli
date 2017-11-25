import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';
import {WhitelistUserService} from '../../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ShowProgressService} from '../../../../shared/services/show-progress.service';
import {duration} from 'moment';
import {DragulaService} from 'ng2-dragula';
import {ICourse} from '../../../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-whitelist-edit',
  templateUrl: './whitelist-edit.component.html',
  styleUrls: ['./whitelist-edit.component.scss']
})
export class WhitelistEditComponent implements OnInit {

  dragableWhitelistUser: IWhitelistUser[] = [];
  finishRestCall = false;
  @Input() course: ICourse;
  @Input() dragulaBagId;
  @Input() total = 0;
  search = '';
  @Input() set searchString(search: string) {
    this.search = search;
    this.finishRestCall = false;
    if (search !== '') {
      this.whitelistUserService.searchWhitelistUsers(this.course._id, search).then((found) => {
        const idList: string[] = this.course.whitelist.map((u) => u._id);
        this.dragableWhitelistUser = found.filter(user => (idList.indexOf(user._id) < 0));
        this.finishRestCall = true;
      });
    }
  }

  get searchString() {
    return this.search;
  }

  isToggled = false;
  whitelistUser: any = {firstName: '', lastName: '', uid: '', courseId: null};

  constructor(private whitelistUserService: WhitelistUserService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
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
    });
  }

}
