// tslint:disable:no-console

import {IUnitModel, Unit} from '../../models/units/Unit';

class FileUnitMigration20181019 {

  async up() {
    const fileUnitTypeMissing: IUnitModel[] = await Unit.find({__t: 'file', fileUnitType: {$exists: false}});

    for (const unit of fileUnitTypeMissing) {
      try {
        await unit.save({validateBeforeSave: false});
      } catch (error) {
        console.log('Could not add "fileUnitType" to unit ' + unit.name + ' error: ' + error);
      }
    }

    return true;
  }
}

export = FileUnitMigration20181019;
