import {
  Body, JsonController, UseBefore, Get, Param, Put, Delete, Authorized, CurrentUser,
  BadRequestError, UnauthorizedError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {IUser} from '../../../shared/models/IUser';
import {IUserModel, User} from '../models/User';

@JsonController('/users')
@UseBefore(passportJwtMiddleware)
export class UserController {

  @Get('/')
  @Authorized(['teacher', 'admin'])
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
  getUser(@Param('id') id: string, @CurrentUser() currentUser?: IUser) {
    return User.findById(id)
      .populate('progress')
      .then((user) => {
        return this.cleanUserObject(id, user, currentUser);
      });
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() user: IUser, @CurrentUser() currentUser?: IUser) {
    return User.find({'role': 'admin'})
      .then((adminUsers) => {
        if (adminUsers.length === 1 &&
          adminUsers[0].get('id') === id &&
          adminUsers[0].role === 'admin' &&
          user.role !== 'admin') {
          throw new BadRequestError('There are no other users with admin privileges.');
        } else {
          return User.find({ $and: [{'email': user.email}, {'_id': { $ne: user._id }}]});
        }
      })
      .then((emailInUse) => {
        if (emailInUse.length > 0) {
          throw new BadRequestError('This mail address is already in use.');
        } else {
          return User.findById(id);
          // return User.findByIdAndUpdate(id, user, {'new': true});
        }
      })
      .then((oldUser: IUserModel) => {
        if (user.role !== oldUser.role && currentUser.role !== 'admin') {
          throw new UnauthorizedError('Only users with admin privileges can change roles');
        } else if (user.uid !== oldUser.uid && currentUser.role !== 'admin') {
          throw new UnauthorizedError('Only users with admin privileges can change uids');
        } else {
          return User.findByIdAndUpdate(id, user, {'new': true});
        }
      })
      .then((updatedUser) => {
        updatedUser.markModified('password');
        return updatedUser.save(user);
      })
      .then((savedUser) => this.cleanUserObject(id, savedUser, currentUser));
  }

  private cleanUserObject(id: string, user: IUserModel, currentUser?: IUser) {
    user.password = null;
    if (currentUser._id !== id && currentUser.role !== 'teacher') {
      user.uid = null;
    }
    return user.toObject({virtuals: true});
  }

  @Authorized('admin')
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return User.findByIdAndRemove(id);
  }
}
