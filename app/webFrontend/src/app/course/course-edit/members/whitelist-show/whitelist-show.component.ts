import {Component, OnInit, Output, Input, ViewEncapsulation, EventEmitter} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';

@Component({
  selector: 'app-whitelist-show',
  templateUrl: './whitelist-show.component.html',
  styleUrls: ['./whitelist-show.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhitelistShowComponent implements OnInit {

  @Input() dragUsers: any = [];
  @Input() dragulaBagId;
  @Input() show: boolean;
  @Input() fieldId: string;

  @Output() onRemove = new EventEmitter<IWhitelistUser>();

  constructor() { }

  ngOnInit() {
  }

  remove(user: IWhitelistUser) {
    const idList: string[] = this.dragUsers.map((u) => u._id);
    const index: number = idList.indexOf(user._id);
    this.dragUsers.splice(index, 1);
    this.onRemove.emit(user);
  }

}
