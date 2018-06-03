import {ICourse} from '../../../shared/models/ICourse';
import {ICourseDashboard} from '../../../shared/models/ICourseDashboard';
import {ICourseView} from '../../../shared/models/ICourseView';
import * as mongoose from 'mongoose';
import {User, IUserModel} from './User';
import {ILectureModel, Lecture} from './Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {InternalServerError} from 'routing-controllers';
import {IUser} from '../../../shared/models/IUser';
import * as winston from 'winston';
import {ObjectID} from 'bson';
import {Directory} from './mediaManager/Directory';
import {IProperties} from '../../../shared/models/IProperties';
import {extractMongoId} from '../utilities/ExtractMongoId';
import {ChatRoom} from './ChatRoom';


interface ICourseModel extends ICourse, mongoose.Document {
  exportJSON: (sanitize?: boolean) => Promise<ICourse>;
  checkPrivileges: (user: IUser) => IProperties;
  forDashboard: (user: IUser) => ICourseDashboard;
  forView: () => ICourseView;
  populateLecturesFor: (user: IUser) => this;
  processLecturesFor: (user: IUser) => Promise<this>;
}

interface ICourseMongoose extends mongoose.Model<ICourseModel> {
}

let Course: ICourseMongoose;

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
    ],
    enableChat: {
      type: Boolean,
      default: true
    },
    chatRooms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom'
    }]
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: ICourseModel, ret: any, {currentUser}: { currentUser?: IUser }) {
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

courseSchema.pre('save', async function() {
  const course = <ICourseModel>this;
  if(this.isNew  && course.enableChat){
    await ChatRoom.create({
      room: {
        roomType: 'Course',
        roomFor: course
      }
    });
  }
});

// Cascade delete
courseSchema.pre('remove', async function () {
  const localCourse = <ICourseModel><any>this;
  try {
    const dic = await Directory.findById(localCourse.media);
      if (dic) {
    await dic.remove();
    }
    for (const lec of localCourse.lectures) {
      const lecDoc = await Lecture.findById(lec);
      await lecDoc.remove();
    }
  } catch (error) {
    winston.log('warn', 'course (' + localCourse._id + ') cloud not be deleted!');
    throw new Error('Delete Error: ' + error.toString());
  }
});

courseSchema.methods.exportJSON = async function (sanitize: boolean = true) {
  const obj = this.toObject();

  // remove unwanted informations
  {
    // mongo properties
    delete obj._id;
    delete obj.createdAt;
    delete obj.__v;
    delete obj.updatedAt;

    // custom properties
    if (sanitize) {
      delete obj.accessKey;
      delete obj.active;
      delete obj.whitelist;
      delete obj.students;
      delete obj.courseAdmin;
      delete obj.teachers;
    }
  }

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


courseSchema.methods.checkPrivileges = function (user: IUser) {
  const {userIsAdmin, ...userIs} = User.checkPrivileges(user);

  const courseAdminId = extractMongoId(this.courseAdmin);

  const userIsCourseAdmin: boolean = user._id === courseAdminId;
  const userIsCourseTeacher: boolean = this.teachers.some((teacher: IUserModel) => user._id === extractMongoId(teacher));
  const userIsCourseStudent: boolean = this.students.some((student: IUserModel) => user._id === extractMongoId(student));
  const userIsCourseMember: boolean = userIsCourseAdmin || userIsCourseTeacher || userIsCourseStudent;

  const userCanEditCourse: boolean = userIsAdmin || userIsCourseAdmin || userIsCourseTeacher;
  const userCanViewCourse: boolean = (this.active && userIsCourseStudent) || userCanEditCourse;

  return {
    userIsAdmin, ...userIs,
    courseAdminId,
    userIsCourseAdmin, userIsCourseTeacher, userIsCourseStudent, userIsCourseMember,
    userCanEditCourse, userCanViewCourse
  };
};

courseSchema.methods.forDashboard = function (user: IUser): ICourseDashboard {
  const {
    name, active, description, enrollType
  } = this;
  const {
    userCanEditCourse, userCanViewCourse, userIsCourseAdmin, userIsCourseTeacher, userIsCourseMember
  } = this.checkPrivileges(user);
  return {
    // As in ICourse:
    _id: <string>extractMongoId(this._id),
    name, active, description, enrollType,

    // Special properties for the dashboard:
    userCanEditCourse, userCanViewCourse, userIsCourseAdmin, userIsCourseTeacher, userIsCourseMember
  };
};

courseSchema.methods.forView = function (): ICourseView {
  const {
    name, description,
    courseAdmin, teachers,
    lectures
  } = this;
  return {
    _id: <string>extractMongoId(this._id),
    name, description,
    courseAdmin: User.forCourseView(courseAdmin),
    teachers: teachers.map((teacher: IUser) => User.forCourseView(teacher)),
    lectures: lectures.map((lecture: any) => lecture.toObject())
  };
};

courseSchema.methods.populateLecturesFor = function (user: IUser) {
  const isTeacherOrAdmin = (user.role === 'teacher' || user.role === 'admin');
  return this.populate({
    path: 'lectures',
    populate: {
      path: 'units',
      virtuals: true,
      match: {$or: [{visible: undefined}, {visible: true}, {visible: !isTeacherOrAdmin}]},
      populate: {
        path: 'progressData',
        match: {user: {$eq: user._id}}
      }
    }
  });
};

courseSchema.methods.processLecturesFor = async function (user: IUser) {
  this.lectures = await Promise.all(this.lectures.map(async (lecture: ILectureModel) => {
    return await lecture.processUnitsFor(user);
  }));
  return this;
};

Course = mongoose.model<ICourseModel, ICourseMongoose>('Course', courseSchema);

export {Course, ICourseModel};
