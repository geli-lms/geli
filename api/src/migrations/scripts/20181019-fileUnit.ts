// tslint:disable:no-console

import {Unit} from '../../models/units/Unit';
import {IFileUnitModel} from '../../models/units/FileUnit';

class FileUnitMigration20181019 {

  async up() {
    const fileUnitTypeMissing: IFileUnitModel[] = <any>await Unit.find({__t: 'file', fileUnitType: {$exists: false}});

    for (const unit of fileUnitTypeMissing) {
      try {
        unit.fileUnitType = 'file';
        await unit.save({validateBeforeSave: false});
      } catch (error) {
        console.log('Could not add "fileUnitType" to unit ' + unit.name + ' error: ' + error);
      }
    }

    return true;
  }
}

export = FileUnitMigration20181019;
