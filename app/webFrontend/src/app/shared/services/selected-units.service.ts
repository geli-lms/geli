import { Injectable } from '@angular/core';
import {IUnit} from '../../../../../../shared/models/units/IUnit';

@Injectable()
export class SelectedUnitsService {
  unitIds: any[] = [];

  constructor() { }

  getSelectedData() {
    return this.unitIds;
  }

  addUnit(unit: IUnit) {
    this.unitIds.push(unit._id);
  }

  removeUnit(unit: IUnit) {
    const index = this.unitIds.indexOf(unit._id, 0);
    if (index > -1) {
      this.unitIds.splice(index, 1);
    }
  }

  clearData() {
    this.unitIds = [];
  }
}
