import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {ILecture} from '../../../../../../../../shared/models/ILecture';

@Component({
  selector: 'app-lecture-checkbox',
  templateUrl: './lecture-checkbox.component.html',
  styleUrls: ['./lecture-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LectureCheckboxComponent implements OnInit {
  @Input()
  chkbox: boolean;
  @Input()
  lecture: ILecture;

  constructor() {
    this.chkbox = false;
  }

  ngOnInit() {
  }




}
