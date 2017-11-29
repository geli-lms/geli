import {ICourse} from '../../../shared/models/ICourse';
import * as mongoose from 'mongoose';
import {User} from './User';
import {ILectureModel, Lecture} from './Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {InternalServerError} from 'routing-controllers';
import {IUser} from '../../../shared/models/IUser';
import * as winston from 'winston';

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
      'enum': ['free', 'whitelist'],
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
        ret._id = ret._id.toString();
        ret.hasAccessKey = false;
        if (ret.accessKey) {
          delete ret.accessKey;
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
  delete obj.students;
  delete obj.courseAdmin;
  delete obj.teachers;

  // "populate" lectures
  const lectures: Array<mongoose.Types.ObjectId> = obj.lectures;
  obj.lectures = [];

  obj.lectures = await Promise.all(lectures.map((lectureId: mongoose.Types.ObjectId) => {
    return Lecture.findById(lectureId).then((lecture: ILectureModel) => {
      if (lecture) {
        return lecture.exportJSON();
      } else {
        winston.log('warn', 'lecture(' + lectureId + ') was referenced by course(' + this._id + ') but does not exist anymore');
      }
    });
  }));
  return obj;
};

courseSchema.statics.importJSON = async function (course: ICourse, admin: IUser) {
  // set Admin
  course.courseAdmin = admin;

  // course shouldn't be visible for students after importTest
  course.active = false;

  // importTest lectures
  const lectures: Array<ILecture> = course.lectures;
  course.lectures = [];

  try {
    const isCourseDuplicated = (await Course.findOne({name: course.name})) !== null;
    if (isCourseDuplicated) {
      course.name = course.name + ' (copy)';
    }
    const savedCourse = await new Course(course).save();
    await Promise.all(lectures.map((lecture: ILecture) => {
      return Lecture.importJSON(lecture, savedCourse._id);
    }));

    return (await Course.findById(savedCourse._id)).toObject();
  } catch (err) {
    const newError = new InternalServerError('Failed to import course');
    newError.stack += '\nCaused by: ' + err.message + '\n' + err.stack;
    throw newError;
  }
};

const Course = mongoose.model<ICourseModel>('Course', courseSchema);

export {Course, ICourseModel};
