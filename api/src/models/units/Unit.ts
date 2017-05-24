import * as mongoose from 'mongoose';
import {IUnit} from '../../../../shared/models/IUnit';

interface IUnitModel extends IUnit, mongoose.Document {
}

const unitSchema = new mongoose.Schema({
    filePath: {
      type: String,
    },
    fileName: {
      type: String,
    },
    progressable: {
      type: Boolean
    }
  },
  {
    discriminatorKey: 'type',
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
      }
    },
  }
);

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

export {Unit, IUnitModel};
