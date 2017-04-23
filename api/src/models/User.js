"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const userSchema = new mongoose.Schema({
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
        firstName: { type: String },
        lastName: { type: String }
    },
    role: {
        type: String,
        'enum': ['student', 'teacher', 'tutor', 'admin'],
        'default': 'student'
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret) {
            ret._id = ret.id;
            delete ret.id;
        }
    }
});
// Pre-save of user to database, hash password if password is modified or new
userSchema.pre('save', function (next) {
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
});
// Method to compare password for login
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return callback(err, false);
        }
        return callback(null, isMatch);
    });
};
const User = mongoose.model('User', userSchema);
exports.User = User;
