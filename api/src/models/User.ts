import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import {IUser} from '../../../shared/models/IUser';
import {IUserSubSafe} from '../../../shared/models/IUserSubSafe';
import {IUserSubTeacher} from '../../../shared/models/IUserSubTeacher';
import {IUserSubCourseView} from '../../../shared/models/IUserSubCourseView';
import {NativeError} from 'mongoose';
import * as crypto from 'crypto';
import {isNullOrUndefined} from 'util';
import {isEmail} from 'validator';
import {errorCodes} from '../config/errorCodes';
import {allRoles} from '../config/roles';
import {extractMongoId} from '../utilities/ExtractMongoId';
import {ensureMongoToObject} from '../utilities/EnsureMongoToObject';
import {Course, ICourseModel} from './Course';
import {NotificationSettings} from './NotificationSettings';
import {Notification} from './Notification';
import {WhitelistUser} from './WhitelistUser';
import {Progress} from './progress/Progress';
import fs = require('fs');


export interface IUserPrivileges {
  userIsAdmin: boolean;
  userIsTeacher: boolean;
  userIsStudent: boolean;
  userEditLevel: number;
}

export interface IUserEditPrivileges extends IUserPrivileges {
  currentEditLevel: number;
  targetEditLevel: number;
  editSelf: boolean;
  editLevelHigher: boolean;
  editAllowed: boolean;
}

interface IUserModel extends IUser, mongoose.Document {
  exportPersonalData: () => Promise<IUser>;
  isValidPassword: (candidatePassword: string) => Promise<boolean>;
  checkPrivileges: () => IUserPrivileges;
  checkEditUser: (targetUser: IUser) => IUserEditPrivileges;
  checkEditableBy: (currentUser: IUser) => IUserEditPrivileges;
  forSafe: () => IUserSubSafe;
  forTeacher: () => IUserSubTeacher;
  forCourseView: () => IUserSubCourseView;
  forUser: (otherUser: IUser) => IUserSubSafe | IUserSubTeacher | IUser;
  authenticationToken: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  isActive: boolean;
  updatedAt: Date;
}
interface IUserMongoose extends mongoose.Model<IUserModel> {
  getEditLevel: (user: IUser) => number;
  getEditLevelUnsafe: (user: any) => number | undefined;
  checkPrivileges: (user: IUser) => IUserPrivileges;
  checkEditUser: (currentUser: IUser, targetUser: IUser) => IUserEditPrivileges;
  forSafe: (user: IUser | IUserModel) => IUserSubSafe;
  forTeacher: (user: IUser | IUserModel) => IUserSubTeacher;
  forCourseView: (user: IUser | IUserModel) => IUserSubCourseView;
  forUser: (user: IUser | IUserModel, otherUser: IUser) => IUserSubSafe | IUserSubTeacher | IUser;
}
let User: IUserMongoose;

const userSchema = new mongoose.Schema({
    uid: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      validate: [{validator: (value: any) => isEmail(value), msg: 'Invalid email.'}],
      index: true
    },
    password: {
      type: String,
      required: true,
      validate: new RegExp(errorCodes.password.regex.regex)
    },
    profile: {
      firstName: {
        type: String,
        index: true,
        maxlength: 64
      },
      lastName: {
        type: String,
        index: true,
        maxlength: 64
      },
      picture: {
        path: {type: String},
        name: {type: String},
        alias: {type: String}
      },
      theme: {type: String}
    },
    role: {
      type: String,
      'enum': allRoles,
      'default': 'student'
    },
    lastVisitedCourses: [ {
      type: String
  }],
    authenticationToken: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    isActive: {type: Boolean, 'default': false},
    updatedAt: { type: Date, required: true, default: Date.now }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: function (doc: any, ret: any) {
        ret._id = ret._id.toString();
        delete ret.password;
      }
    }
  });
userSchema.index({
  uid: 'text',
  email: 'text',
  'profile.firstName': 'text',
  'profile.lastName': 'text'
}, {name: 'user_combined'});

function hashPassword(next: (err?: NativeError) => void) {
  const user = this, SALT_FACTOR = 5;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, SALT_FACTOR)
    .then((hash) => {
      user.password = hash;
    })
    .then(() => next())
    .catch(next);
}

function generateActivationToken(next: (err?: NativeError) => void) {
  // check if user wasn't activated by the creator
  if ( !this.isActive && isNullOrUndefined(this.authenticationToken)) {
    // set new authenticationToken
    this.authenticationToken = generateSecureToken();
  }

  next();
}

function generatePasswordResetToken(next: (err?: NativeError) => void) {
  // check if passwordReset is requested -> (resetPasswordExpires is set)
  if (!isNullOrUndefined(this.resetPasswordExpires) && isNullOrUndefined(this.resetPasswordToken)) {
    this.resetPasswordToken = generateSecureToken();
  }

  next();
}

// returns random 64 byte long base64 encoded Token
// maybe this could be shortened
function generateSecureToken() {
  return crypto.randomBytes(64).toString('base64');
}

function removeEmptyUid(next: (err?: NativeError) => void) {
  if (this.uid != null && this.uid.length === 0) {
    this.uid = undefined;
  }

  next();
}

// Pre-save of user to database, hash password if password is modified or new
userSchema.pre('save', hashPassword);
userSchema.pre('save', generateActivationToken);
userSchema.pre('save', generatePasswordResetToken);
userSchema.pre('save', removeEmptyUid);

// TODO: Move shared code of save and findOneAndUpdate hook to one function
userSchema.pre('findOneAndUpdate', function (next) {
  const SALT_FACTOR = 5;
  const newPassword = this.getUpdate().password;
  if (typeof newPassword !== 'undefined') {
    bcrypt.hash(newPassword, SALT_FACTOR)
      .then((hash) => {
        this.findOneAndUpdate({}, {password: hash});
      })
      .then(() => next())
      .catch(next);
  } else {
    next();
  }
});

// delete all user data
userSchema.pre('remove', async function () {
  const localUser = <IUserModel><any>this;
  try {
    const promises = [];
    // notifications
    promises.push(Notification.deleteMany({user: localUser._id}));
    // notificationsettings
    promises.push(NotificationSettings.deleteMany({user: localUser._id}));
    // whitelists
    promises.push(WhitelistUser.deleteMany({uid: localUser.uid}));
    // remove user form courses
    promises.push(Course.updateMany(
      {$or: [
          {students: localUser._id},
          {teachers: localUser._id}
          ]},
      {$pull: {
            'students': localUser._id,
            'teachers': localUser._id
          }
      }));
    // progress
    promises.push(Progress.deleteMany({user: localUser._id}));

    // image
    const path = localUser.profile.picture.path;
    if (path && fs.existsSync(path)) {
      fs.unlinkSync(path);
    }

    await Promise.all(promises);

  } catch (e) {
    throw new Error('Delete Error: ' + e.toString());
  }
});

// Method to compare password for login
userSchema.methods.isValidPassword = function (candidatePassword: string) {
  if (typeof  candidatePassword === 'undefined') {
    candidatePassword = '';
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkPrivileges = function (): IUserPrivileges {
  return User.checkPrivileges(this);
};

userSchema.methods.checkEditUser = function (targetUser: IUser): IUserEditPrivileges {
  return User.checkEditUser(this, targetUser);
};

userSchema.methods.checkEditableBy = function (currentUser: IUser): IUserEditPrivileges {
  return User.checkEditUser(currentUser, this);
};

userSchema.methods.forSafe = function (): IUserSubSafe {
  return User.forSafe(this);
};

userSchema.methods.forTeacher = function (): IUserSubTeacher {
  return User.forTeacher(this);
};

userSchema.methods.forCourseView = function (): IUserSubCourseView {
  return User.forCourseView(this);
};

userSchema.methods.forUser = function (otherUser: IUser): IUserSubSafe | IUserSubTeacher | IUser {
  return User.forUser(this, otherUser);
};

userSchema.methods.exportPersonalData = async function () {
  await this.populate(
    {
      path: 'lastVisitedCourses',
      model: Course,
      select: 'name description -_id teachers'
    })
    .execPopulate();

  const lastVisitedCourses = await Promise.all(this.lastVisitedCourses.map( async (course: ICourseModel) => {
    return await course.exportJSON(true, true);
  }));

  const obj = this.toObject();

  obj.lastVisitedCourses = lastVisitedCourses;

  // remove unwanted informations
  // mongo properties
  delete obj._id;
  delete obj.createdAt;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.id;

  // custom properties

  return obj;
};

userSchema.methods.getCourses = async function () {
  const localUser = <IUserModel><any>this;
  return Course.find({courseAdmin: localUser._id});
};

// The idea behind the editLevels is to only allow updates if the currentUser "has a higher level" than the target.
// (Or when the currentUser is an admin or targets itself.)
const editLevels: {[key: string]: number} = {
  student: 0,
  teacher: 0,
  admin: 2,
};

userSchema.statics.getEditLevel = function (user: IUser): number {
  return editLevels[user.role];
};

userSchema.statics.getEditLevelUnsafe = function (user: any): number | undefined {
  return editLevels[user.role];
};

userSchema.statics.checkPrivileges = function (user: IUser): IUserPrivileges {
  const userIsAdmin: boolean = user.role === 'admin';
  const userIsTeacher: boolean = user.role === 'teacher';
  const userIsStudent: boolean = user.role === 'student';
  // NOTE: The 'tutor' role is currently unused / disabled.
  // const userIsTutor: boolean = user.role === 'tutor';

  const userEditLevel: number = User.getEditLevel(user);

  return {userIsAdmin, userIsTeacher, userIsStudent, userEditLevel};
};

userSchema.statics.checkEditUser = function (currentUser: IUser, targetUser: IUser): IUserEditPrivileges {
  const {userIsAdmin, ...userIs} = User.checkPrivileges(currentUser);

  const currentEditLevel = User.getEditLevel(currentUser);
  const targetEditLevel = User.getEditLevel(targetUser);

  const editSelf = extractMongoId(currentUser._id) === extractMongoId(targetUser._id);
  const editLevelHigher = currentEditLevel > targetEditLevel;

  // Note that editAllowed only means authorization to edit SOME (herein unspecified) properties.
  // If false, it serves as a definite indicator that absolutely NO edit access is to be granted,
  // but if true, it by itself is not enough information to know what exactly is allowed.
  // (I.e. it DOES NOT mean unrestricted editing capabilties.)
  const editAllowed = userIsAdmin || editSelf || editLevelHigher;

  return {
    userIsAdmin, ...userIs,
    currentEditLevel, targetEditLevel,
    editSelf, editLevelHigher,
    editAllowed
  };
};

userSchema.statics.forSafe = function (user: IUser | IUserModel): IUserSubSafe {
  const {
    profile: {firstName, lastName}
  } = user;
  const result: IUserSubSafe = {
    _id: <string>extractMongoId(user._id),
    profile: {firstName, lastName}
  };
  const picture = ensureMongoToObject(user.profile.picture);
  if (Object.keys(picture).length) {
    result.profile.picture = picture;
  }
  return result;
};

userSchema.statics.forTeacher = function (user: IUser | IUserModel): IUserSubTeacher {
  const {
    uid, email
  } = user;
  return {
    ...User.forSafe(user),
    uid, email
  };
};

userSchema.statics.forCourseView = function (user: IUser | IUserModel): IUserSubCourseView {
  const {
    email
  } = user;
  return {
    ...User.forSafe(user),
    email
  };
};

userSchema.statics.forUser = function (user: IUser | IUserModel, otherUser: IUser): IUserSubSafe | IUserSubTeacher | IUser {
  const {userIsTeacher, userIsAdmin} = User.checkPrivileges(otherUser);
  const isSelf = extractMongoId(user._id) === extractMongoId(otherUser._id);
  if (isSelf || userIsAdmin) {
    return ensureMongoToObject(user);
  } else if (userIsTeacher) {
    return User.forTeacher(user);
  } else {
    return User.forSafe(user);
  }
};

User = mongoose.model<IUserModel, IUserMongoose>('User', userSchema);

export {User, IUserModel};
