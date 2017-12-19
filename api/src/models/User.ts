import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import {IUser} from '../../../shared/models/IUser';
import {NativeError} from 'mongoose';
import * as crypto from 'crypto';
import {isNullOrUndefined} from 'util';
import { isEmail } from 'validator';
import * as errorCodes from '../config/errorCodes'
import {ICourse} from '../../../shared/models/ICourse';

interface IUserModel extends IUser, mongoose.Document {
  isValidPassword: (candidatePassword: string) => Promise<boolean>;
  authenticationToken: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  isActive: boolean;
}

const userSchema = new mongoose.Schema({
    uid: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      validate: [{ validator: (value: any) => isEmail(value), msg: 'Invalid email.' }]
    },
    password: {
      type: String,
      required: true,
      validate: new RegExp(errorCodes.errorCodes.password.regex.regex)
    },
    profile: {
      firstName: {type: String},
      lastName: {type: String},
      picture: {
        path: {type: String},
        name: {type: String},
        alias: {type: String}
      }
    },
    role: {
      type: String,
      'enum': ['student', 'teacher', 'tutor', 'admin'],
      'default': 'student'
    },
    lastVisitedCourses: [ {
        ICourse: {type: String}
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

const User = mongoose.model<IUserModel>('User', userSchema);

export {User, IUserModel};
