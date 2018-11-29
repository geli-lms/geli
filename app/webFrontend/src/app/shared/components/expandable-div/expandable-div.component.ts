import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import {ExpandableDivHeaderTags} from './expandable-div-header-tags.enum';

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
  @Input()
  headerTag: string;
  @Input()
  opened: boolean;

  constructor() { }

  ngOnInit() {
    this.opened = true;
    this.headerTag = this.headerTag || ExpandableDivHeaderTags.Text;
  }

  notify() {
    this.opened = !this.opened;
    this.notifyParent.emit(null);
  }
}
