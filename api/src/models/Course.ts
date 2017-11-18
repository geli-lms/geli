import {ICourse} from '../../../shared/models/ICourse';
import * as mongoose from 'mongoose';
import {User} from './User';
import {ILectureModel, Lecture} from './Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {InternalServerError} from 'routing-controllers';
import {IUser} from '../../../shared/models/IUser';

interface ICourseModel extends ICourse, mongoose.Document {
  export: () => Promise<ICourse>;
  import: (course: ICourse, admin: IUser) => Promise<ICourse>;
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
courseSchema.pre('remove', function(next: () => void) {
  Lecture.find({'_id': {$in: this.lectures}}).exec()
    .then((lectures) => Promise.all(lectures.map(lecture => lecture.remove())))
    .then(next)
    .catch(next);
});

courseSchema.methods.export = function() {
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
  const lectures: Array<mongoose.Types.ObjectId>  = obj.lectures;
  obj.lectures = [];

  return Promise.all(lectures.map((lectureId: mongoose.Types.ObjectId) => {
    return Lecture.findById(lectureId).then((lecture: ILectureModel) => {
      return lecture.export();
    });
  }))
  .then((exportedLectures: ILecture[]) => {
    obj.lectures = exportedLectures;
    return obj;
  });
};

courseSchema.methods.import = function(course: ICourse, admin: IUser) {
  // set Admin
  course.courseAdmin = admin;

  // import lectures
  const lectures: Array<ILecture>  = course.lectures;
  course.lectures = [];

  return new Course(course).save()
    .then((savedcourse: ICourseModel) => {
      const courseId = savedcourse._id;

      return Promise.all(lectures.map((lecture: ILecture) => {
        return new Lecture().import(lecture, courseId);
      }))
      .then((importedLectures: ILecture[]) => {
        savedcourse.lectures.concat(importedLectures);
        return savedcourse.save();
      });
    })
    .then((importedCourse: ICourseModel) => {
      return importedCourse.toObject();
    })
    .catch((err: any) => {
      throw new InternalServerError(err);
    });
};

const Course = mongoose.model<ICourseModel>('Course', courseSchema);

export {Course, ICourseModel};
