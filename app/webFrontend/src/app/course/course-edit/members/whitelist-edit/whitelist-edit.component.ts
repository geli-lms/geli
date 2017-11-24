import {Component, Input, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';
import {WhitelistUserService} from '../../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ShowProgressService} from '../../../../shared/services/show-progress.service';
import {duration} from 'moment';

@Component({
  selector: 'app-whitelist-edit',
  templateUrl: './whitelist-edit.component.html',
  styleUrls: ['./whitelist-edit.component.scss']
})
export class WhitelistEditComponent implements OnInit {

  dragableWhitelistUser: IWhitelistUser[] = [];
  finishRestCall = false;
  search = '';
  @Input() set searchString(search: string) {
    this.search = search;
    this.finishRestCall = false;
    if (search !== '') {
      this.whitelistUserService.searchWhitelistUsers(search).then((found) => {
        this.dragableWhitelistUser = found;
        this.finishRestCall = true;
      });
    }
  }

  get searchString() {
    return this.search;
  }

  isToggled = false;
  whitelistUser: any = {firstName: '', lastName: '', uid: ''};

  constructor(private whitelistUserService: WhitelistUserService,
              private showProgress: ShowProgressService,
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
    return this.whitelistUserService.createItem(this.whitelistUser);
  }

}
