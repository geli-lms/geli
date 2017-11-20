import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-expandable-div',
  templateUrl: './expandable-div.component.html',
  styleUrls: ['./expandable-div.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpandableDivComponent implements OnInit {
  @Output()
  notifyParent: EventEmitter<any> = new EventEmitter();
  @Input()
  title: string;
  opened: boolean;

  constructor() { }

  ngOnInit() {
    this.opened = true;
  }

  notify() {
    this.opened = !this.opened;
    this.notifyParent.emit(null);
  }
}
