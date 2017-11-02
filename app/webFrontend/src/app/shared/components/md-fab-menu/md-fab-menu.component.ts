import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-md-fab-menu',
  templateUrl: './md-fab-menu.component.html',
  styleUrls: ['./md-fab-menu.component.scss']
})
export class MdFabMenuComponent implements OnInit {

  @Input()
  public fabTooltip: string;

  @Input()
  public disabled = false;

  @Input()
  open = false;

  @Input()
  onClick: () => void;

  constructor() {
  }

  ngOnInit() {
  }
}
