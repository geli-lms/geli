import * as mongoose from 'mongoose';
import {Unit} from './Unit';

const videoUnitSchema = new mongoose.Schema({
  filePath: {
    type: String,
  },
  fileName: {
    type: String,
  }
});

const VideoUnit = Unit.discriminator('video', videoUnitSchema);

export {VideoUnit}
