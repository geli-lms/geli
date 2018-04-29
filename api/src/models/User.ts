import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import {IUser} from '../../../shared/models/IUser';
import {IUserSubSafeBase} from '../../../shared/models/IUserSubSafeBase';
import {IUserSubSafe} from '../../../shared/models/IUserSubSafe';
import {IUserSubTeacher} from '../../../shared/models/IUserSubTeacher';
import {NativeError} from 'mongoose';
import * as crypto from 'crypto';
import {isNullOrUndefined} from 'util';
import {isEmail} from 'validator';
import * as errorCodes from '../config/errorCodes';
import {IProperties} from '../../../shared/models/IProperties';
import {extractMongoId} from '../utilities/ExtractMongoId';

interface IUserModel extends IUser, mongoose.Document {
  isValidPassword: (candidatePassword: string) => Promise<boolean>;
  checkPrivileges: () => IProperties;
  forSafeBase: () => IUserSubSafeBase;
  forSafe: () => IUserSubSafe;
  forTeacher: () => IUserSubTeacher;
  authenticationToken: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  isActive: boolean;
}
interface IUserMongoose extends mongoose.Model<IUserModel> {
  checkPrivileges: (user: IUser) => IProperties;
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
      validate: new RegExp(errorCodes.errorCodes.password.regex.regex)
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
      'enum': ['student', 'teacher', 'tutor', 'admin'],
      'default': 'student'
    },
    lastVisitedCourses: [ {
      type: String
  }],
    authenticationToken: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    isActive: {type: Boolean, 'default': false}
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
  // check if user is new and wasn't activated by the creator
  if (this.isNew && !this.isActive && isNullOrUndefined(this.authenticationToken)) {
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

// Method to compare password for login
userSchema.methods.isValidPassword = function (candidatePassword: string) {
  if (typeof  candidatePassword === 'undefined') {
    candidatePassword = '';
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkPrivileges = function (): IProperties {
  return User.checkPrivileges(this);
};

userSchema.methods.forSafeBase = function (): IUserSubSafeBase {
  const {
    profile: {firstName, lastName}
  } = this;
  const result: IUserSubSafeBase = {
    _id: <string>extractMongoId(this._id),
    profile: {firstName, lastName}
  };
  const picture = this.profile.picture.toObject();
  if (Object.keys(picture).length) {
    result.profile.picture = picture;
  }
  return result;
};

userSchema.methods.forSafe = function (): IUserSubSafe {
  return {
    ...this.forSafeBase(),
    gravatar: crypto.createHash('md5').update(this.email).digest('hex')
  };
};

userSchema.methods.forTeacher = function (): IUserSubTeacher {
  const {
    uid, email
  } = this;
  return {
    ...this.forSafeBase(),
    uid, email
  };
};

userSchema.statics.checkPrivileges = function (user: IUser): IProperties {
  const userIsAdmin: boolean = user.role === 'admin';
  const userIsTeacher: boolean = user.role === 'teacher';
  const userIsStudent: boolean = user.role === 'student';
  // NOTE: The 'tutor' role exists and has fixtures, but currently appears to be unimplemented.
  // const userIsTutor: boolean = user.role === 'tutor';

  return {userIsAdmin, userIsTeacher, userIsStudent};
};

User = mongoose.model<IUserModel, IUserMongoose>('User', userSchema);

export {User, IUserModel};
