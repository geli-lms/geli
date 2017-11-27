import { Injectable } from '@angular/core';
import {IUnit} from '../../../../../../shared/models/units/IUnit';

@Injectable()
export class SelectedUnitsService {
  units: IUnit[] = [];

  constructor() { }

  getSelectedData() {
    return this.units;
  }

  addUnit(unit: IUnit) {
    this.units.push(unit);
  }

  removeUnit(unit: IUnit) {
    const index = this.units.indexOf(unit, 0);
    if (index > -1) {
      this.units.splice(index, 1);
    }
  }

  clearData() {
    this.units = [];
  }
}
