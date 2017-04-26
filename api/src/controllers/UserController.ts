import {sign} from 'jsonwebtoken';
import {Request, Response} from 'express';
import {Body, Post, JsonController, Req, Res, HttpError, UseBefore, Get, Param, Put} from 'routing-controllers';
import {json as bodyParserJson} from 'body-parser';
import passportLoginMiddleware from '../security/passportLoginMiddleware';

import config from '../config/main';
import {IUser} from '../models/IUser';
import {IUserModel, User} from '../models/User';

@JsonController('/user')
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

  @Post('/login')
  @UseBefore(bodyParserJson(), passportLoginMiddleware) // We need body-parser for passport to find the credentials
  postLogin(@Req() request: Request) {
    const user = <IUserModel>(<any>request).user;

    return {
      token: 'JWT ' + UserController.generateToken(user),
      user: user.toObject()
    };
    }

  @Post('/register')
  postRegister(@Body() user: IUser, @Res() res: Response) {
    return User.findOne({email: user.email})
      .then((existingUser) => {
        // If user is not unique, return error
        if (existingUser) {
          throw new HttpError(422, 'That email address is already in use.');
        }

        return new User(user).save();
      })
      .then((savedUser) => {
        return {
          token: 'JWT ' + UserController.generateToken(savedUser),
          user: savedUser.toObject()
        };
      });
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
