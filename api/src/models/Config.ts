import {IConfig} from '../../../shared/models/IConfig';
import * as mongoose from 'mongoose';

interface IConfigModel extends IConfig, mongoose.Document {
  exportJSON: () => Promise<IConfig>;
}

const configSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    value: {
      type: String
    }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
          delete ret._id;
        }
      }
    }
);

const Config = mongoose.model<IConfigModel>('Config', configSchema);

export {Config, IConfigModel};
