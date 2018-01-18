// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {ObjectID} from 'bson';
import {IUnitModel} from '../../models/units/Unit';
import {ITaskUnitModel} from '../../models/units/TaskUnit';
import {ITaskUnit} from '../../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../../shared/models/task/ITask';
import {IUnit} from '../../../../shared/models/units/IUnit';

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

const Unit = mongoose.model<IUnitModel>('Unit', unitSchema);

const fileUnitSchema = new mongoose.Schema({
  files: [
    {
      path: {
        type: String,
      },
      name: {
        type: String,
      },
      alias: {
        type: String,
      },
      size: {
        type: Number
      }
    }
  ],
  fileUnitType: {
    type: String,
    required: true
  }
}, {
  toObject: {
    transform: function (doc: any, ret: any) {
      ret._id = ret._id.toString();
      ret.files = ret.files.map((file: any) => {
        file._id = file._id.toString();
        return file;
      });
      ret._course = ret._course.toString();
    }
  },
});

const FileUnit = mongoose.model('File', fileUnitSchema);

class FileUnitMigration {

  async up() {
    console.log('FileUnit up was called');
  }

  down() {
    console.log('FileUnit down was called');
  }
}

export = FileUnitMigration;
