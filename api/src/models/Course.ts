import {ICourse} from '../../../shared/models/ICourse';
import {ICourseDashboard} from '../../../shared/models/ICourseDashboard';
import {ICourseView} from '../../../shared/models/ICourseView';
import * as mongoose from 'mongoose';
import {User, IUserModel} from './User';
import {ILectureModel, Lecture} from './Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {InternalServerError} from 'routing-controllers';
import {IUser} from '../../../shared/models/IUser';
import {ObjectID} from 'bson';
import {Directory} from './mediaManager/Directory';
import {IProperties} from '../../../shared/models/IProperties';
import {extractMongoId} from '../utilities/ExtractMongoId';
import {ChatRoom, IChatRoomModel} from './ChatRoom';

import {Picture} from './mediaManager/File';

interface ICourseModel extends ICourse, mongoose.Document {
  exportJSON: (sanitize?: boolean, onlyBasicData?: boolean) => Promise<ICourse>;
  checkPrivileges: (user: IUser) => IProperties;
  forDashboard: (user: IUser) => ICourseDashboard;
  forView: () => ICourseView;
  populateLecturesFor: (user: IUser) => this;
  processLecturesFor: (user: IUser) => Promise<this>;
}

interface ICourseMongoose extends mongoose.Model<ICourseModel> {
  exportPersonalData: (user: IUser) => Promise<ICourse>;
  changeCourseAdminFromUser: (userFrom: IUser, userTo: IUser) => Promise<ICourseMongoose>;
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
    chatRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
      }
    ],
    freeTextStyle: {
      type: String,
      enum: ['', 'theme1', 'theme2', 'theme3', 'theme4'],
      default: ''
    },
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

        if (ret.chatRooms) {
          ret.chatRooms = ret.chatRooms.map(extractMongoId);
        }
      }
    }
  }
);

courseSchema.pre('save', async function () {
  const course = <ICourseModel>this;
  if (this.isNew) {
    const chatRoom: IChatRoomModel = await ChatRoom.create({
      name: 'General',
      description: 'This is a general chat for the course ' + course.name,
      room: {
        roomType: 'Course',
        roomFor: course
      }
    });
    course.chatRooms.push(chatRoom._id);
    Object.assign(this, course);
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
    if (localCourse.image) {
      const picture: any = await Picture.findById(localCourse.image);
      await picture.remove();
    }
  } catch (error) {
    throw new Error('Delete Error: ' + error.toString());
  }
});

courseSchema.methods.exportJSON = async function (sanitize: boolean = true, onlyBasicData: boolean = false) {
  const obj = this.toObject();

  // remove unwanted informations
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
    delete obj.media;
    delete obj.chatRooms;
    delete obj.freeTextStyle;
  }

  if (onlyBasicData) {
    delete obj.id;
    delete obj.hasAccessKey;
    return obj;
  }

  // "populate" lectures
  const lectures: Array<mongoose.Types.ObjectId> = obj.lectures;
  obj.lectures = [];

  for (const lectureId of lectures) {
    const lecture: ILectureModel = await Lecture.findById(lectureId);
    if (lecture) {
      const lectureExport = await lecture.exportJSON();
      obj.lectures.push(lectureExport);
    }
  }

  if (obj.image) {
    const imageId: mongoose.Types.ObjectId = obj.image;
    obj.image = await Picture.findById(imageId);
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

courseSchema.statics.exportPersonalData = async function (user: IUser) {
  const conditions: any = {};
  conditions.$or = [];
  conditions.$or.push({students: user._id});
  conditions.$or.push({teachers: user._id});
  conditions.$or.push({courseAdmin: user._id});

  const courses = await Course.find(conditions, 'name description -_id');

  return Promise.all(courses.map(async (course: ICourseModel) => {
    return await course.exportJSON(true, true);
  }));
};

courseSchema.statics.changeCourseAdminFromUser = async function (userFrom: IUser, userTo: IUser) {
  return Course.updateMany({courseAdmin: userFrom._id}, {courseAdmin: userTo._id});
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

/**
 * Modifies the Course data to be used by the courses dashboard.
 *
 * @param {IUser} user
 * @returns {Promise<ICourseDashboard>}
 */
courseSchema.methods.forDashboard = async function (user: IUser): Promise<ICourseDashboard> {
  const {
    name, active, description, enrollType
  } = this;

  const image = (this.image) ? (await Picture.findById(this.image)).toObject() : null;

  const {
    userCanEditCourse, userCanViewCourse, userIsCourseAdmin, userIsCourseTeacher, userIsCourseMember
  } = this.checkPrivileges(user);
  return {
    // As in ICourse:
    _id: <string>extractMongoId(this._id),
    name, active, description, enrollType, image,

    // Special properties for the dashboard:
    userCanEditCourse, userCanViewCourse, userIsCourseAdmin, userIsCourseTeacher, userIsCourseMember
  };
};

courseSchema.methods.forView = function (): ICourseView {
  const {
    name, description,
    courseAdmin, teachers,
    lectures, chatRooms, freeTextStyle
  } = this;
  return {
    _id: <string>extractMongoId(this._id),
    name, description,
    courseAdmin: User.forCourseView(courseAdmin),
    teachers: teachers.map((teacher: IUser) => User.forCourseView(teacher)),
    lectures: lectures.map((lecture: any) => lecture.toObject()),
    chatRooms: chatRooms.map(extractMongoId),
    freeTextStyle
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
