"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const passport_jwt_1 = require("passport-jwt");
const main_1 = require("../config/main");
exports.default = new passport_jwt_1.Strategy({
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: main_1.default.secret
}, (payload, done) => {
    User_1.User.findById(payload._id)
        .then((user) => {
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    })
        .catch(done);
});
