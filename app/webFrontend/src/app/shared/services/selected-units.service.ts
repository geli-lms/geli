import { Injectable } from '@angular/core';
import {IUnit} from "../../../../../../shared/models/units/IUnit";

@Injectable()
export class SelectedUnitsService {
  units: IUnit[] = [];

  constructor() { }

  getSelectedData() {
    return this.units;
  }

  addUnit(unit: IUnit) {
    this.units.push(unit);
    console.log('array size after add:' + this.units.length);
  }

  removeUnit(unit: IUnit) {
    var index = this.units.indexOf(unit, 0);
    if (index > -1) {
      this.units.splice(index, 1);
    }
    console.log('array size after remove:' + this.units.length);
  }

  clearData() {
    this.units = []; //this.units.splice(o, this.units.length);
    //console.log('array size after clear:' + this.units.length);
  }
}
