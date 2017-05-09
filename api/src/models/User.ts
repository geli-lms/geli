import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import {IUser} from '../../../shared/models/IUser';
import {NativeError} from 'mongoose';
import * as crypto from 'crypto';

interface IUserModel extends IUser, mongoose.Document {
    comparePassword: (candidatePassword: string, callback: (error: Error, result: boolean) => void) => void;
    generateActivationToken: () => void;
    authenticationToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
}

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      lowercase: true,
      unique: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profile: {
      firstName: {type: String},
      lastName: {type: String}
    },
    role: {
      type: String,
      'enum': ['student', 'teacher', 'tutor', 'admin'],
      'default': 'student'
    },
    authenticationToken: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
  },
  {
    timestamps: true,
    toObject: {
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

  // TODO: Refactor to use promises
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function (error, hash) {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  });
}

// Pre-save of user to database, hash password if password is modified or new
userSchema.pre('save', hashPassword);

// TODO: This does not yet work, because the this context id different on update
// userSchema.pre('update', hashPassword);
// userSchema.pre('findOneAndUpdate', hashPassword);

// Method to compare password for login
userSchema.methods.comparePassword = function (candidatePassword: string, callback: (error: Error, result: boolean) => void) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err, isMatch) => {
      if (err) {
        return callback(err, false);
      }

      return callback(null, isMatch);
    }
  );
};

userSchema.methods.generateActivationToken = () => {
  return crypto.randomBytes(64).toString('base64');
};


const User = mongoose.model<IUserModel>('User', userSchema);

export {User, IUserModel};
