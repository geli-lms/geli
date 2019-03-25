// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUnitModel} from '../../models/units/Unit';
import {IFileUnit} from '../../../../shared/models/units/IFileUnit';
import {File} from '../../models/mediaManager/File';
import {Course} from '../../models/Course';
import {Directory} from '../../models/mediaManager/Directory';
import {ICourse} from '../../../../shared/models/ICourse';
import fs = require('fs');

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
      const courses = await Course.find().exec();
      const directories: any = {};
      const updatedCoursesMap: any = {};
      const updatedCourses = await Promise.all(courses.map(async (course) => {
        const courseObj: ICourse = <ICourse>course.toObject();
        const returnObj: any = {};
        if (!courseObj.hasOwnProperty('media')) {
          const directoryObj: any = {
            name: courseObj.name,
            subDirectories: [],
            files: []
          };

          const createdDirectory: any = await Directory.create(directoryObj);
          courseObj.media = createdDirectory._id;
          const updatedCourse = await Course.findOneAndUpdate({'_id': courseObj._id}, courseObj, {new: true}).exec();

          directories[createdDirectory._id] = await createdDirectory.toObject();

          updatedCoursesMap[courseObj._id] = await updatedCourse.toObject();
          return updatedCourse;
        } else {
          const directory = await Directory.findById(courseObj.media).exec();
          directories[directory._id] = await directory.toObject();
          updatedCoursesMap[courseObj._id] = courseObj;
          return course;
        }
      }));
      const fileUnits = await Unit.find({'__t': 'file'}).exec();
      const updatedFileUnits = await Promise.all(fileUnits.map(async (fileUnit) => {
        if (fileUnit._id instanceof mongoose.Types.ObjectId) {
          const fileUnitObj: IFileUnit = <IFileUnit>fileUnit.toObject();
          fileUnitObj.files = await Promise.all(fileUnitObj.files.map(async (file) => {
            if (file instanceof mongoose.Types.ObjectId) {
              return file;
            }

            const oldFile = <any>file;
            let absolutePath = '';
            let fileStats = null;
            try {
              absolutePath = fs.realpathSync(oldFile.path);
              fileStats = fs.statSync(oldFile.path);
            } catch (error) {
              fileStats = null;
              absolutePath = '';
            }

            if (absolutePath.length === 0) {
              try {
                absolutePath = fs.realpathSync('api/' + oldFile.path);
                fileStats = fs.statSync('api/' + oldFile.path);
              } catch (error) {
                return null;
              }
            }

            if (typeof oldFile.size === 'undefined') {
              oldFile.size = fileStats.size;
            }

            const newFile = {
              physicalPath: absolutePath,
              name: oldFile.alias,
              size: oldFile.size,
              link: oldFile.name,
              mimeType: 'plain/text'
            };

            const createdFile = await File.create(newFile);
            return createdFile._id;
          }));

          fileUnitObj.files = await fileUnitObj.files.filter((element, index, array) => {
            return (element !== null);
          });

          const directoryId = updatedCoursesMap[fileUnitObj._course].media.toString();
          fileUnitObj._id = mongoose.Types.ObjectId(fileUnitObj._id);
          fileUnitObj._course = mongoose.Types.ObjectId(fileUnitObj._course);
          directories[directoryId].files = directories[directoryId].files.concat(fileUnitObj.files);

          const unitAfterReplace = await mongoose.connection.collection('units')
            .findOneAndReplace({'_id': fileUnit._id}, fileUnitObj);
          return fileUnitObj;
        }
      }));

      for (const directoryId of Object.keys(directories)) {
        const directory = directories[directoryId];
        const updatedDirectory = await Directory.findOneAndUpdate({'_id': directoryId}, directory, {new: true}).exec();
      }

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
