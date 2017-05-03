import {IUser} from '../models/IUser';
import {sign} from 'jsonwebtoken';
import config from '../config/main';

export class JwtUtils {
  static generateToken(user: IUser) {
    return sign(
      {_id: user._id.toString()},
      config.secret,
      {
        expiresIn: 10080 // in seconds
      }
    );
  }
}
