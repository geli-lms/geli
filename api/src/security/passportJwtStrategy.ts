import {User} from '../models/User';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import config from '../config/main';


export default new JwtStrategy(
  {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: config.secret
  },
  (payload, done) => {
    User.findById(payload._id)
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
