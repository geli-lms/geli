import config from '../config/main';
import {Action} from 'routing-controllers';
import {User} from '../models/User';
import jwt = require('jsonwebtoken');
import * as mongoose from 'mongoose';

export class CurrentUserDecorator {
  static checkCurrentUser(action: Action): Promise<any> {
    const token = action.request.headers['authorization'].split(' ')[1];
    const decoded: any = jwt.verify(token, config.secret);
    const userId = decoded._id;

    return User.findById(mongoose.Types.ObjectId(userId))
    .then((user) => user.toObject());
  }
}
