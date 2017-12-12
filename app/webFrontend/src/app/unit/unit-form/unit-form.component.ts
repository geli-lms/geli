import {Component, OnInit, Input} from '@angular/core';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../../shared/models/units/IUnit';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.scss']
})
export class UnitFormComponent implements OnInit {

  @Input() model: IUnit;
  @Input() type: string;
  @Input() unitType: string;
  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  constructor() {
  }

  ngOnInit() {}
}
