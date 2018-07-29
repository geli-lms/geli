import {Action, UnauthorizedError} from 'routing-controllers';
import {User} from '../models/User';
import * as mongoose from 'mongoose';

export class RoleAuthorization {
  static checkAuthorization(action: Action, roles: string[]): Promise<any> {
    const jwtData = action.request.jwtData;
    if (!jwtData) {
      throw new UnauthorizedError();
    }
    const userId = jwtData.tokenPayload._id;

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
