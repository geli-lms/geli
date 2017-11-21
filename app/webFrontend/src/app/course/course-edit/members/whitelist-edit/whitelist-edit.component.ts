import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';

@Component({
  selector: 'app-whitelist-edit',
  templateUrl: './whitelist-edit.component.html',
  styleUrls: ['./whitelist-edit.component.scss']
})
export class WhitelistEditComponent implements OnInit {

  isToggled = false;
  whitelistUser: IWhitelistUser = {_id: null, firstName: '', lastName: '', uid: ''};

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }


}
