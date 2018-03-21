// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUnitModel} from '../../models/units/Unit';
import {ObjectID} from 'bson';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';
import fs = require('fs');
import {File} from '../../models/mediaManager/File';

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

const Unit = mongoose.model<IUnitModel>('FileOldUnit', unitSchema);

const fileSchema = new mongoose.Schema({
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

const FileUnit = mongoose.model('Files', fileSchema);

class FileUnitMigration {

  async up() {
    console.log('FileUnit up was called');
    try {
      const fileUnits = await Unit.find({'__t': 'file'}).exec();
      const updatedFileUnits = await Promise.all(fileUnits.map(async (fileUnit) => {
        if (fileUnit._id instanceof ObjectID) {
          const fileUnitObj: IFileUnit = <IFileUnit>fileUnit.toObject();
          fileUnitObj.files = await Promise.all(fileUnitObj.files.map(async (file) => {
            if (file instanceof ObjectID) {
              return file;
            }

            const oldFile = <any>file;
            let absolutePath = '';
            try {
              absolutePath = fs.realpathSync(oldFile.path);
            } catch (error) {
              absolutePath = '';
            }

            if (absolutePath.length === 0) {
              absolutePath = fs.realpathSync('api/' + oldFile.path);
            }

            const newFile = {
              physicalPath: absolutePath,
              name: oldFile.alias,
              size: oldFile.size,
              link: oldFile.name
            };

            const createdFile = await File.create(newFile);
            return createdFile._id;
          }));

          fileUnitObj._id = new ObjectID(fileUnitObj._id);

          const unitAfterReplace = await mongoose.connection.collection('units')
            .findOneAndReplace({'_id': fileUnit._id}, fileUnitObj);
          return fileUnitObj;
        }
      }));
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  down() {
    console.log('FileUnit down was called');
  }
}

export = FileUnitMigration;
