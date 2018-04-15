import {ICourse} from '../../../shared/models/ICourse';
import * as mongoose from 'mongoose';
import {User, IUserModel} from './User';
import {ILectureModel, Lecture} from './Lecture';
import {ILecture} from '../../../shared/models/ILecture';
import {InternalServerError} from 'routing-controllers';
import {IUser} from '../../../shared/models/IUser';
import * as winston from 'winston';
import {ObjectID} from 'bson';
import {IProperties} from '../../../shared/models/IProperties';
import Pick from '../utilities/Pick';

interface ICourseModel extends ICourse, mongoose.Document {
  exportJSON: (sanitize?: boolean) => Promise<ICourse>;
  checkPrivileges: (user: IUser) => IProperties;
}
interface ICourseMongoose extends mongoose.Model<ICourseModel> {
  getSanitized: (user: IUser, courses: ICourseModel[], targets: ICourseObt) => Promise<IProperties[]>;
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


function canUserRoleEditCourse(user: IUser) {
  const roleIsTeacher: boolean = user.role === 'teacher';
  const roleIsAdmin: boolean = user.role === 'admin';
  return roleIsTeacher || roleIsAdmin;
};

function extractId(value: any, fallback?: any) {
  if (value instanceof Object) {
    if (value._bsontype === 'ObjectID') {
      return {_id: value.toString()};
    } else if ('id' in value) {
      return {_id: value.id}
    }
  }
  return fallback;
}

function extractIds(values: any[], fallback?: any) {
  const results: any[] = [];
  for (const value of values) {
    const result = extractId(value, fallback);
    if (result !== undefined) {
      results.push(result);
    }
  }
  return results;
}

courseSchema.methods.checkPrivileges = function (user: IUser) {
  const roleCanEditCourse: boolean = canUserRoleEditCourse(user);
  const userIsAdmin: boolean = user.role === 'admin';
  const courseAdmin = extractId(this.courseAdmin);

  const userIsCourseAdmin: boolean = user._id === courseAdmin._id;
  const userIsCourseTeacher: boolean = this.teachers.some((teacher: IUserModel) => user._id === extractId(teacher)._id);
  const userIsCourseStudent: boolean = this.students.some((student: IUserModel) => user._id === extractId(student)._id);

  const userCanEditCourse: boolean = roleCanEditCourse && (userIsCourseAdmin || userIsCourseTeacher);
  const userIsParticipant: boolean = userIsCourseStudent || userCanEditCourse;
  const userCanViewCourse: boolean = (this.active && userIsCourseStudent) || userCanEditCourse || userIsAdmin;

  return {roleCanEditCourse, userIsAdmin, courseAdmin,
      userIsCourseAdmin, userIsCourseTeacher, userIsCourseStudent,
      userCanEditCourse, userIsParticipant, userCanViewCourse};
}


function arrayUnion(...arrays: any[]) {
  return [...new Set([].concat(...arrays))];
}

function keysToPath(keys: string[]) {
  return keys.map(path => ({path}));
}

// ICourse(Model)-Obtain option interfaces:
type ICourseObtMode = string[];
interface ICourseObtType {
  empty?: ICourseObtMode;
  selfid?: ICourseObtMode;
  onlyid?: ICourseObtMode;
  copy?: ICourseObtMode;
  populate?: ICourseObtMode;
}
interface ICourseObt {
  safe?: ICourseObtType;
  editor?: ICourseObtType;
  all?: ICourseObtType;
}
// Normalized:
type ICourseNormObtMode = ICourseObtMode;
interface ICourseNormObtType {
  empty: ICourseNormObtMode;
  selfid: ICourseNormObtMode;
  onlyid: ICourseNormObtMode;
  copy: ICourseNormObtMode;
  populate: ICourseNormObtMode;
  populatePaths: IProperties;
  pickKeys: string[];
}
interface ICourseNormObt {
  safe: ICourseNormObtType;
  editor: ICourseNormObtType;
}

function normalizeCourseObtMode(modeObt?: ICourseObtMode): ICourseNormObtMode {
  if (modeObt !== undefined) {
    return modeObt.slice();
  } else {
    return [];
  }
}

function normalizeCourseObt(obt: ICourseObt): ICourseNormObt {
  const regularTypes = ['safe', 'editor']; // i.e. non-'all'
  const modes = ['empty', 'selfid', 'onlyid', 'copy', 'populate'];
  const result: IProperties = {};

  for (const type of regularTypes) {
    const typeResult = result[type] = <IProperties>{};
    const typeObt = (<IProperties>obt)[type] || {};
    for (const mode of modes) {
      typeResult[mode] = normalizeCourseObtMode(typeObt[mode]);
    }
  }

  const allTypeObt = obt.all || {};
  for (const mode of modes) {
    const normMode = normalizeCourseObtMode((<IProperties>allTypeObt)[mode]);
    for (const type of regularTypes) {
      result[type][mode].push(...normMode);
    }
  }

  for (const type of regularTypes) {
    const typeResult = <ICourseNormObtType>result[type];
    typeResult.pickKeys = arrayUnion(typeResult.copy, typeResult.populate, typeResult.selfid);
    typeResult.populatePaths = keysToPath(typeResult.populate);
  }

  return <ICourseNormObt>result;
}

courseSchema.statics.getSanitized = async function(user: IUser, courses: ICourseModel[], targets: ICourseObt) {
  const options = normalizeCourseObt(targets);

  return await Promise.all(courses.map(async (course) => {
    const {userCanEditCourse} = course.checkPrivileges(user);
    const typeOptions: IProperties = userCanEditCourse ? options.editor : options.safe;
    await Course.populate(course, typeOptions.populatePaths);

    const courseObject: IProperties = course.toObject();
    const sanitizedCourseObject = Pick.only(typeOptions.pickKeys, courseObject);
    for (const key of typeOptions.onlyid) {
      const value = (<IProperties>course)[key];
      sanitizedCourseObject[key] = Array.isArray(value) ? extractIds(value) : extractId(value);
    }
    for (const key of typeOptions.selfid) {
      const value = (<IProperties>course)[key];
      if (Array.isArray(value)) {
        sanitizedCourseObject[key] = extractIds(value).filter(x => user._id === x._id);
      } else {
        const extracted = extractId(value);
        if (user._id === extracted._id) {
          sanitizedCourseObject[key] = extracted;
        }
      }
    }
    Pick.asEmpty(typeOptions.empty, courseObject, sanitizedCourseObject);

    return sanitizedCourseObject;
  }));
};

Course = mongoose.model<ICourseModel, ICourseMongoose>('Course', courseSchema);

export {Course, ICourseModel};
