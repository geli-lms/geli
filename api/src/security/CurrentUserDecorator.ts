import {Action} from 'routing-controllers';
import {User} from '../models/User';
import * as mongoose from 'mongoose';

export class CurrentUserDecorator {
  static checkCurrentUser(action: Action): Promise<any> {
    const jwtData = action.request.jwtData;
    const userId = jwtData.tokenPayload._id;

    return User.findById(mongoose.Types.ObjectId(userId))
    .then((user) => user.toObject());
  }
}
