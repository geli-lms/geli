import config from '../config/main';
import {Action} from 'routing-controllers';
import {User} from '../models/User';
import jwt = require('jsonwebtoken');
import * as mongoose from 'mongoose';

export class RoleAuthorization {
  static checkAuthorization(action: Action, roles: string[]): Promise<any> {
    const token = action.request.headers['authorization'].split(' ')[1];
    const decoded: any = jwt.verify(token, config.secret);
    const userId = decoded._id;

    return User.findById(mongoose.Types.ObjectId(userId))
      .then((user) => {
        if (user && !roles.length) {
          return true;
        }

        if (user && (roles.indexOf(user.role) !== -1)) {
          return true;
        }

        return false;
      });
  }
}
