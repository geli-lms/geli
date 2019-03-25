import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-sticky-toolbar',
  templateUrl: './sticky-toolbar.component.html',
  styleUrls: ['./sticky-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class StickyToolbarComponent implements OnInit {
  @Input() anchor: string;

  constructor() {
  }

  ngOnInit() {
  }

}
