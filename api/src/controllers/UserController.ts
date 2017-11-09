import {
  Body, JsonController, UseBefore, Get, Param, Put, Delete, Authorized, CurrentUser,
  BadRequestError, ForbiddenError, UploadedFile, Post
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import fs = require('fs');

import {IUser} from '../../../shared/models/IUser';
import {IUserModel, User} from '../models/User';
const multer = require('multer');

const uploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'uploads/users/');
    },
    filename: (req: any, file: any, cb: any) => {
      const id = req.params.id;
      const randomness = '-' + (Math.floor(Math.random() * 8999) + 1000);
      const extPos = file.originalname.lastIndexOf('.');
      const ext = (extPos !== -1) ? `.${file.originalname.substr(extPos + 1).toLowerCase()}` : '';
      cb(null, id + randomness + ext);
    }
  }),
};

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

  @Post('/picture/:id')
  addUserPicture(@UploadedFile('file', {options: uploadOptions}) file: any, @Param('id') id: string, @Body() data: any,
                 @CurrentUser() currentUser: IUser) {
    return User.findById(id)
      .then((user: IUserModel) => {
        if (user.profile.picture && user.profile.picture.path && fs.existsSync(user.profile.picture.path)) {
          fs.unlinkSync(user.profile.picture.path);
        }

        user.profile.picture = {
          path: file.path,
          name: file.filename,
          alias: file.originalname
        };
        return user.save();
      })
      .then((user) => {
        return this.cleanUserObject(id, user, currentUser);
      })
      .catch((error) => {
        throw new BadRequestError(error);
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
          if (!isValidPassword && user.password.length > 0) {
            throw new BadRequestError('You must specify your current password if you want to set a new password.');
          } else {
            if (user.password.length === 0) {
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

  @Authorized('admin')
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return User.find({'role': 'admin'})
    .then((adminUsers) => {
      if (adminUsers.length === 1 &&
        adminUsers[0].get('id') === id &&
        adminUsers[0].role === 'admin') {
        throw new BadRequestError('There are no other users with admin privileges.');
      } else {
        return User.findByIdAndRemove(id);
      }
    })
    .then(() => {
      return {result: true};
    });
  }

  private cleanUserObject(id: string, user: IUserModel, currentUser?: IUser) {
    user.password = '';
    if (currentUser._id !== id && (currentUser.role !== <string>'teacher' || currentUser.role !== <string>'admin')) {
      user.uid = null;
    }
    return user.toObject({virtuals: true});
  }
}
