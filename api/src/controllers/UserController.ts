import {
  Body, JsonController, UseBefore, Get, Param, Put, Delete, Authorized, CurrentUser,
  BadRequestError, ForbiddenError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {IUser} from '../../../shared/models/IUser';
import {IUserModel, User} from '../models/User';

@JsonController('/users')
@UseBefore(passportJwtMiddleware)
export class UserController {

  @Get('/')
  @Authorized(['teacher', 'admin'])
  getUsers(@CurrentUser() currentUser?: IUser) {
    return User.find({})
      .then((users) => {
        return users.map((user) => this.cleanUserObject(null, user, currentUser));
      });
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
  updateUser(@Param('id') id: string, @Body() user: any, @CurrentUser() currentUser?: IUser) {
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
          throw new ForbiddenError('Only users with admin privileges can change roles');
        } else if (user.uid !== oldUser.uid && currentUser.role !== 'admin') {
          throw new ForbiddenError('Only users with admin privileges can change uids');
        } else {
          if (oldUser.uid && user.uid === null) {
            user.uid = oldUser.uid;
          }

          return oldUser.isValidPassword(user.currentPassword);
        }
      })
      .then((isValidPassword) => {
        if (typeof user.password !== 'undefined') {
          if (!(currentUser.role === 'admin' && currentUser._id !== user._id) && !isValidPassword && user.password.length > 0) {
            throw new BadRequestError('You must specify your current password if you want to set a new password.');
          } else {
            if (user.password === 0) {
              delete user.password;
            }
            return User.findOneAndUpdate({'_id': id}, user, {new: true});
          }
        } else {
          return User.findOneAndUpdate({'_id': id}, user, {new: true});
        }
      })
      .then((updatedUser) => {
        return updatedUser.toObject({virtuals: true});
      });
  }

  private cleanUserObject(id: string, user: IUserModel, currentUser?: IUser) {
    user.password = '';
    if (currentUser._id !== id && (currentUser.role !== <string>'teacher' || currentUser.role !== <string>'admin')) {
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
