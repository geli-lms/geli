"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const passport_local_1 = require("passport-local");
exports.default = new passport_local_1.Strategy({
    usernameField: 'email'
}, (email, password, done) => {
    console.log('login strategy');
    User_1.User.findOne({ email: email })
        .then((user) => {
        if (!user) {
            done(null, false, { message: 'Your login details could not be verified. Please try again.' });
            return;
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false, { message: 'Your login details could not be verified. Please try again.' });
            }
            console.log('logged in');
            return done(null, user);
        });
    })
        .catch(done);
});
