import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
