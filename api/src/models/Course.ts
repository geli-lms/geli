import {ICourse} from '../../../shared/models/ICourse';
import * as mongoose from 'mongoose';
import {User} from './User';
import {Lecture} from './Lecture';

interface ICourseModel extends ICourse, mongoose.Document {
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
    courseAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
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


const Course = mongoose.model<ICourseModel>('Course', courseSchema);

export {Course, ICourseModel};
