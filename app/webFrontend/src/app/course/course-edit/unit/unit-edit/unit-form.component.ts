import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../../shared/models/ILecture';
import {IUnit} from "../../../../../../../../shared/models/units/IUnit";

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.scss']
})
export class UnitFormComponent implements OnInit {

  @Input() model: IUnit;
  @Input() type: string;
  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Output() onDone = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  public done() {
    this.onDone.emit(true);
  }
}
