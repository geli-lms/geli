import {ICourse} from '../../../shared/models/ICourse';
import * as mongoose from 'mongoose';
import {User} from './User';
import {ILectureModel, Lecture} from './Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {InternalServerError} from 'routing-controllers';
import {IUser} from '../../../shared/models/IUser';
import * as winston from 'winston';
import {ObjectID} from 'bson';

interface ICourseModel extends ICourse, mongoose.Document {
  exportJSON: () => Promise<ICourse>;
}

const courseSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    active: {
      type: Boolean
    },
    description: {
      type: String
    },
    courseAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    media:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Directory'
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
      }
    ],
    accessKey: {
      type: String
    },
    enrollType: {
      type: String,
      'enum': ['free', 'whitelist', 'accesskey'],
      'default': 'free'
    },
    whitelist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WhitelistUser'
      }
    ]
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        if (ret.hasOwnProperty('_id') && ret._id !== null) {
          ret._id = ret._id.toString();
        }

        if (ret.hasOwnProperty('courseAdmin') && ret.courseAdmin !== null && (ret.courseAdmin instanceof ObjectID)) {
          ret.courseAdmin = ret.courseAdmin.toString();
        }
        ret.hasAccessKey = false;
        if (ret.accessKey) {
          ret.hasAccessKey = true;
        }
      }
    }
  }
);

// Cascade delete
courseSchema.pre('remove', function (next: () => void) {
  Lecture.find({'_id': {$in: this.lectures}}).exec()
    .then((lectures) => Promise.all(lectures.map(lecture => lecture.remove())))
    .then(next)
    .catch(next);
});

courseSchema.methods.exportJSON = async function () {
  const obj = this.toObject();

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;

  // custom properties
  delete obj.accessKey;
  delete obj.active;
  delete obj.whitelist;
  delete obj.students;
  delete obj.courseAdmin;
  delete obj.teachers;

  // "populate" lectures
  const lectures: Array<mongoose.Types.ObjectId> = obj.lectures;
  obj.lectures = [];

  for (const lectureId of lectures) {
    const lecture: ILectureModel = await Lecture.findById(lectureId);
    if (lecture) {
      const lectureExport = await lecture.exportJSON();
      obj.lectures.push(lectureExport);
    } else {
      winston.log('warn', 'lecture(' + lectureId + ') was referenced by course(' + this._id + ') but does not exist anymore');
    }
  }

  return obj;
};

courseSchema.statics.importJSON = async function (course: ICourse, admin: IUser, active: boolean) {
  // set Admin
  course.courseAdmin = admin;

  // course shouldn't be visible for students after import
  // until active flag is explicitly set (e.g. fixtures)
  course.active = (active === true);

  // importTest lectures
  const lectures: Array<ILecture> = course.lectures;
  course.lectures = [];

  try {
    // Need to disabled this rule because we can't export 'Course' BEFORE this function-declaration
    // tslint:disable:no-use-before-declare
    const origName = course.name;
    let isCourseDuplicated = false;
    let i = 0;
    do {
      // 1. Duplicate -> 'name (copy)', 2. Duplicate -> 'name (copy 2)', 3. Duplicate -> 'name (copy 3)', ...
      course.name = origName + ((i > 0) ? ' (copy' + ((i > 1) ? ' ' + i : '') + ')' : '');
      isCourseDuplicated = (await Course.findOne({name: course.name})) !== null;
      i++;
    } while (isCourseDuplicated);
    const savedCourse = await new Course(course).save();
    for (const lecture of lectures) {
      await Lecture.schema.statics.importJSON(lecture, savedCourse._id);
    }
    const newCourse: ICourseModel = await Course.findById(savedCourse._id);

    return newCourse.toObject();
    // tslint:enable:no-use-before-declare
  } catch (err) {
    const newError = new InternalServerError('Failed to import course');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};

const Course = mongoose.model<ICourseModel>('Course', courseSchema);

export {Course, ICourseModel};
