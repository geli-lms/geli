import {sign} from 'jsonwebtoken';
import {Request, Response} from 'express';
import {Body, Post, Get, JsonController, Req, Res, HttpError, UseBefore} from 'routing-controllers';
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
  @UseBefore(bodyParserJson(), passportLoginMiddleware)
  getCourses() {
    return User.find({})
      .then((user) => user.map((c) => c.toObject({virtuals: true})));
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
}
