import {Component, OnInit, Input} from '@angular/core';
import {IUnit} from '../../../../../shared/models/units/IUnit';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  @Input() units: IUnit[];

  constructor() {
  }

  ngOnInit() {
  }

}
