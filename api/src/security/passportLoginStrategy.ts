import {User} from '../models/User';
import {Strategy as LocalStrategy} from 'passport-local';
import {isNullOrUndefined} from 'util';
import {UnauthorizedError} from 'routing-controllers';

export default new LocalStrategy(
  {
    usernameField: 'email'
  },
  async (email, password, done: (err: any, user: any) => any) => {
    try {
      const user = await User.findOne({email: email});
      if (!user) {
        return done(new UnauthorizedError('couldNotBeVerified'), null);
      }

      // dismiss password reset process
      if (!isNullOrUndefined(user.resetPasswordToken)) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      }

      const isValid = await user.isValidPassword(password);
      if (!isValid) {
        return done(new UnauthorizedError('couldNotBeVerified'), null);
      } else if (!user.isActive) {
        return done(new UnauthorizedError('notActiveYet'), null);
      } else {
        return done(null, user);
      }
    } catch (err) {
      done(new UnauthorizedError('unknown'), null);
    }
  });
