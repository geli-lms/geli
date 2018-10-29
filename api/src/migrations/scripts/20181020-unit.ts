// tslint:disable:no-console

import {IUnitModel, Unit} from '../../models/units/Unit';

class UnitMigration20181020 {

  async up() {
    const noVisibleField: IUnitModel[] = await Unit.find({visible: {$exists: false}});

    for (const unit of noVisibleField) {
      try {
        unit.visible = true;
        await unit.save();
      } catch (error) {
        console.log('Could not add "visible" to unit ' + unit.name + ' error: ' + error);
      }
    }

    return true;
  }
}

export = UnitMigration20181020;
