import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IVideoUnit} from '../../../../shared/models/units/IVideoUnit';
import {NativeError} from 'mongoose';

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

function prePopulateVideoUnit(next: (err?: NativeError) => void) {
  const debug = 0;
  next();
}

function postPopulateVideoUnit(doc: IVideoUnitModel, next: (err?: NativeError) => void) {
  const debug = 0;
  next();
}

Unit.schema.pre('find', prePopulateVideoUnit);
Unit.schema.post('find', postPopulateVideoUnit);

const VideoUnit = Unit.discriminator('video', videoUnitSchema);

export {VideoUnit, IVideoUnitModel}
