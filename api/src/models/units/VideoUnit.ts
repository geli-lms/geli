import * as mongoose from 'mongoose';
import {IUnitModel, Unit} from './Unit';
import {IVideoUnit} from '../../../../shared/models/units/IVideoUnit';

interface IVideoUnitModel extends IVideoUnit, mongoose.Document {
}

const videoUnitSchema = new mongoose.Schema({
  filePath: {
    type: String,
  },
  fileName: {
    type: String,
  }
});

const VideoUnit = Unit.discriminator('video', videoUnitSchema);

export {VideoUnit, IVideoUnitModel}
