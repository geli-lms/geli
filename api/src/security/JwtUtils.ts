import {IUser} from '../../../shared/models/IUser';
import {sign} from 'jsonwebtoken';
import config from '../config/main';

export class JwtUtils {
  static generateToken(user: IUser, isMediaToken: boolean = false) {
    const data: any = {_id: user._id.toString()};
    if (isMediaToken) {
      data.isMediaToken = true;
    }
    return sign(
      data,
      config.secret,
      {
        expiresIn: 10080 // in seconds
      }
    );
  }
}
