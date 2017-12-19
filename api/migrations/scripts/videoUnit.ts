// tslint:disable:no-console
import {Unit} from '../../src/models/units/Unit';

class VideoUnitMigration {
  async up() {
    console.log('VideoUnit up was called');
    const videoUnits = await Unit.find({'type': 'video'}).exec();
    const updatedFileUnits = await Promise.all(videoUnits.map((videoUnit) => {
    }));
  }

  down() {
    console.log('VideoUnit down was called');
  }
}

export = VideoUnitMigration;
