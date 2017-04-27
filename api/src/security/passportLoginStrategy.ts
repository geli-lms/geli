import {User} from "../models/User";
import {Strategy as LocalStrategy} from "passport-local";

export default new LocalStrategy(
    {
        usernameField: "email"
    },
    (email, password, done) => {
        User.findOne({email: email})
            .then((user) => {
                if (!user) {
                    done(null, false, {message: "Your login details could not be verified. Please try again."});
                    return;
                }

                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        return done(err);
                    }
                    if (!isMatch) {
                        return done(null, false, {message: "Your login details could not be verified. Please try again."});
                    }
                });

                if (user.authenticationToken !== undefined) {
                   return done(null, false, {message: "Your account has not been activated yet."});
                }

                console.log("logged in");
                return done(null, user);
            })
            .catch(done);
    });
