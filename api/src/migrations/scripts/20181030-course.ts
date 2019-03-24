// tslint:disable:no-console
import * as mongoose from 'mongoose';
import {IUser} from '../../../../shared/models/IUser';
import {IUserModel} from '../../models/User';
import {ICourseModel} from '../../models/Course';

const brokenChatRoomSchema = new mongoose.Schema({
    name: {
      type: String
    },
    description: {
      type: String
    },
    room: {
      roomType: String,
      roomFor: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'room.roomType',
      }
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
        delete ret.room;
      }
    }
  }
);

const brokenCourseSchema = new mongoose.Schema({
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
    media: {
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
      enum: ['free', 'whitelist', 'accesskey'],
      default: 'free'
    },
    whitelist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WhitelistUser'
      }
    ],
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Picture'
    },
    chatRooms: [brokenChatRoomSchema]
  },
  {
    timestamps: true,
    collection: 'courses',
    toObject: {
      transform: function (doc: ICourseModel, ret: any, {currentUser}: { currentUser?: IUser }) {
        if (ret.hasOwnProperty('_id') && ret._id !== null) {
          ret._id = ret._id.toString();
        }

        if (ret.hasOwnProperty('courseAdmin') && ret.courseAdmin !== null && (ret.courseAdmin instanceof mongoose.Types.ObjectId)) {
          ret.courseAdmin = ret.courseAdmin.toString();
        }
        ret.hasAccessKey = false;
        if (ret.accessKey) {
          ret.hasAccessKey = true;
        }

        if (currentUser !== undefined) {
          if (doc.populated('teachers') !== undefined) {
            ret.teachers = doc.teachers.map((user: IUserModel) => user.forUser(currentUser));
          }
          if (doc.populated('students') !== undefined) {
            ret.students = doc.students.map((user: IUserModel) => user.forUser(currentUser));
          }
        }
      }
    }
  }
);

const BrokenCourse = mongoose.model<ICourseModel>('BrokenCourse', brokenCourseSchema);

class BrokenCourseMigration {

  async up() {
    console.log('BrokenCourse up was called');
    try {
      const brokenCourses: ICourseModel[] = await BrokenCourse.find({'chatRooms': {$exists: true}});
      await Promise.all(brokenCourses.map(async (brokenCourse: ICourseModel) => {
        const courseObj = brokenCourse.toObject();

        const fixedChatRooms = courseObj.chatRooms.map((chatRoom: any) => {
          if (chatRoom instanceof mongoose.Types.ObjectId) {
            return chatRoom;
          } else {
            return mongoose.Types.ObjectId(chatRoom._id);
          }
        });

        courseObj.chatRooms = fixedChatRooms;

        courseObj._id = mongoose.Types.ObjectId(courseObj._id);

        return await mongoose.connection.collection('courses')
          .findOneAndReplace({'_id': courseObj._id}, courseObj);
      }));
    } catch (error) {
      console.log('1: ' + error);
    }

    console.log('Broken courses have been fixed successfully!');
    return true;
  }
}

export = BrokenCourseMigration;
