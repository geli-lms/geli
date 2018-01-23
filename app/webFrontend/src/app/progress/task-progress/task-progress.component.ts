import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-task-progress',
  templateUrl: './task-progress.component.html',
  styleUrls: ['./task-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskProgressComponent implements OnInit {

  @Input() unit;
  @Input() progress;

  constructor() { }

  ngOnInit() {
  }

}
