import {sign} from 'jsonwebtoken';
import {Body, JsonController, HttpError, UseBefore, Get, Param, Put} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import config from '../config/main';
import {IUser} from '../models/IUser';
import {User} from '../models/User';

@JsonController('/user')
@UseBefore(passportJwtMiddleware)
export class UserController {

  static generateToken(user: IUser) {
    return sign(
      {_id: user._id},
      config.secret,
      {
        expiresIn: 10080 // in seconds
      }
    );
  }

  @Get('/')
  getUsers() {
    return User.find({})
      .then((users) => users.map((user) => user.toObject({ virtuals: true})));
  }

  @Get('/roles')
  getRoles() {
    return User.schema.path('role').enumValues;
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return User.findById(id)
      .then((user) => user.toObject());
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() user: IUser) {
    return User.find({'role': 'admin'})
      .then((adminUsers) => {
        if (adminUsers.length === 1 &&
            adminUsers[0].get('id') === id &&
            adminUsers[0].role === 'admin' &&
            user.role !== 'admin') {
          throw new HttpError(400, 'There are no other users with admin privileges.');
        } else {
          return User.find({ $and: [{'email': user.email}, {'_id': { $ne: user._id }}]});
        }
      })
      .then((emailInUse) => {
        if (emailInUse.length > 0) {
          throw new HttpError(400, 'This mail address is already in use.');
        } else if (typeof user.username !== 'undefined') {
          return User.find({ $and: [{'username': user.username}, {'_id': { $ne: user._id }}]});
        }
      })
      .then((usernameInUse) => {
        if (typeof usernameInUse === 'undefined' || usernameInUse.length === 0) {
          return User.findByIdAndUpdate(id, user, {'new': true});
        } else {
          throw new HttpError(400, 'This username is already in use.');
        }
      })
      .then((savedUser) => savedUser.toObject());
  }
}
