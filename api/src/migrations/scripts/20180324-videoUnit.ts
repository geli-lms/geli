// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUnitModel} from '../../models/units/Unit';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';

const unitSchema = new mongoose.Schema({
    _course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    progressable: {
      type: Boolean
    },
    weight: {
      type: Number
    }
  },
  {
    collection: 'units',
    timestamps: true,
    toObject: {
      transform: function (doc: IUnitModel, ret: any) {
        ret._id = doc._id.toString();
        ret._course = ret._course.toString();
      }
    },
  }
);

const Unit = mongoose.model<IUnitModel>('VideoUnit', unitSchema);

class VideoUnitMigration {
  async up() {
    console.log('VideoUnit up was called');
    try {
      const videoUnits = await Unit.find({'__t': 'video'}).exec();
      const updatedFileUnits = await Promise.all(videoUnits.map(async (videoUnit) => {
        const videoUnitObj: IFileUnit = <IFileUnit>videoUnit.toObject();
        videoUnitObj.fileUnitType = videoUnitObj.__t;
        videoUnitObj.__t = 'file';
        videoUnitObj._id = mongoose.Types.ObjectId(videoUnitObj._id);

        const unitsAfterReplace = await mongoose.connection.collection('units')
          .findOneAndReplace({'_id': videoUnit._id}, videoUnitObj);
        return videoUnitObj;
      }));
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  down() {
    console.log('VideoUnit down was called');
  }
}

export = VideoUnitMigration;
