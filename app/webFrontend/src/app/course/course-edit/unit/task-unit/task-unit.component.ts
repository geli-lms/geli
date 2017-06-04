import { Component, OnInit, Input } from '@angular/core';
import {ITaskUnit} from '../../../../../../../../shared/models/units/ITaskUnit';

@Component({
  selector: 'app-task-unit',
  templateUrl: './task-unit.component.html',
  styleUrls: ['./task-unit.component.scss']
})
export class TaskUnitComponent implements OnInit {

  @Input() taskUnit: ITaskUnit;

  constructor() { }

  ngOnInit() {
  }

}
