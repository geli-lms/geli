import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt-nodejs";
import {IUser} from "./IUser";
import * as crypto from "crypto";

interface IUserModel extends IUser, mongoose.Document {
    comparePassword: (candidatePassword: string, callback: (error: Error, result: boolean) => void) => void;
    authenticationToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
}

function generateSecureActivationToken() {
    return crypto.randomBytes(64).toString("base64");
}

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
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        authenticationToken: {
            type: String
        },
        role: {
            type: String,
            "enum": ["student", "teacher", "tutor", "admin"],
            "default": "student"
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        }
    },
    {
        timestamps: true
    });


// Pre-save of user to database, hash password if password is modified or new
userSchema.pre("save", function (next) {
    const user = this, SALT_FACTOR = 5;

    if (this.isNew){
        user.authenticationToken = generateSecureActivationToken();
    }

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

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


const User = mongoose.model<IUserModel>("User", userSchema);

export {User, IUserModel};
