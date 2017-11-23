import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {IUnit} from '../../../../../../../../../shared/models/units/IUnit';

@Component({
  selector: 'app-unit-checkbox',
  templateUrl: './unit-checkbox.component.html',
  styleUrls: ['./unit-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitCheckboxComponent implements OnInit {
  @Input()
  unit: IUnit;
  @Input()
  chkbox: boolean;

  constructor() {
    this.chkbox = false;
  }

  ngOnInit() {
  }

}
