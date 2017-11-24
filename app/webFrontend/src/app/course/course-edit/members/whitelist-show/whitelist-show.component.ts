import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {DragulaService} from 'ng2-dragula';

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

  constructor() { }

  ngOnInit() {
  }

}
