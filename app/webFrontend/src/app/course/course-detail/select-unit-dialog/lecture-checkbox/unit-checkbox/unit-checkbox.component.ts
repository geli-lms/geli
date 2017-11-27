import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {IUnit} from '../../../../../../../../../shared/models/units/IUnit';
import {SelectedUnitsService} from '../../../../../shared/services/selected-units.service';


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

  constructor(private selectedUnitsService: SelectedUnitsService ) {
    this.chkbox = false;
  }

  ngOnInit() {
  }

  onChange() {
    console.log('checkbox of: ' + this.unit.name + 'changed, value is: ' + this.chkbox);
    if(this.chkbox) {
      this.selectedUnitsService.addUnit(this.unit);
    } else {
      this.selectedUnitsService.removeUnit(this.unit);
    }
  }


}
