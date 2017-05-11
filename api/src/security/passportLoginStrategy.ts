import {User} from '../models/User';
import {Strategy as LocalStrategy} from 'passport-local';

export default new LocalStrategy(
  {
    usernameField: 'email'
  },
  (email, password, done) => {
    User.findOne({email: email})
      .then((user) => {
        if (!user) {
          return done(null, false, {message: 'Your login details could not be verified. Please try again.'});
        }

        user.isValidPassword(password)
          .then((isValid) => {
            if (!isValid) {
              return done(null, false, {message: 'Your login details could not be verified. Please try again.'});
            } else if (!user.isActive) {
              return done(null, false, {message: 'Your account has not been activated yet.'});
            } else {
              return done(null, user);
            }
          });
      })
      .catch(done);
  });
