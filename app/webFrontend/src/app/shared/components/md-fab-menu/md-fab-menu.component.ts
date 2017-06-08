import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-md-fab-menu',
  templateUrl: './md-fab-menu.component.html',
  styleUrls: ['./md-fab-menu.component.scss']
})
export class MdFabMenuComponent implements OnInit {

  @Input() fabTooltip: string;
  open: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  toggleOpen() {
    this.open = !this.open;
  }
}
