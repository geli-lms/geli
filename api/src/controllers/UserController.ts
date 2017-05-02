import {sign} from 'jsonwebtoken';
import {Request, Response} from 'express';
import {Body, Post, JsonController, Req, Res, HttpError, UseBefore, Get, Param, Put} from 'routing-controllers';
import {json as bodyParserJson} from 'body-parser';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import config from '../config/main';
import {IUser} from '../models/IUser';
import {IUserModel, User} from '../models/User';

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
        console.log('AdminUsers: ' + adminUsers.length);
        const _id = adminUsers[0]._id;
        const idTest = adminUsers[0].get('id');
        if (adminUsers.length === 1 &&
            adminUsers[0].get('id') === id &&
            adminUsers[0].role === 'admin' &&
            user.role !== 'admin') {
          throw new HttpError(400, 'There are no other users with admin privileges.');
        } else {
          return User.findByIdAndUpdate(id, user, {'new': true});
        }
      })
      .then((savedUser) => savedUser.toObject());
  }
}
