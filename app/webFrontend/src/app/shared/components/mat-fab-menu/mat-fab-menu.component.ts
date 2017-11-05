import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mat-fab-menu',
  templateUrl: './mat-fab-menu.component.html',
  styleUrls: ['./mat-fab-menu.component.scss']
})
export class MatFabMenuComponent implements OnInit {

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
