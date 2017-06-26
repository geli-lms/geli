import {Body, JsonController, HttpError, UseBefore, Get, Param, Put, Delete, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {IUser} from '../../../shared/models/IUser';
import {User} from '../models/User';

@JsonController('/users')
@UseBefore(passportJwtMiddleware)
export class UserController {

  @Get('/')
  getUsers() {
    return User.find({})
      .then((users) => users.map((user) => user.toObject({ virtuals: true})));
  }

  @Authorized(['admin'])
  @Get('/roles')
  getRoles() {
    // TODO: Fix any cast
    return (<any>User.schema.path('role')).enumValues;
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return User.findById(id)
      .then((user) => user.toObject());
  }

  @Authorized()
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
        } else {
          User.findById(id, {'new': true});
          return User.findByIdAndUpdate(id, user, {'new': true});
        }
      })
      .then((updatedUser) => {
        updatedUser.markModified('password');
        return updatedUser.save(user);
      })
      .then((savedUser) => savedUser.toObject());
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return User.findByIdAndRemove(id);
  }
}
