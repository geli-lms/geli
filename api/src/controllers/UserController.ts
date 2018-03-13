import {
  Body, JsonController, UseBefore, Get, Param, QueryParam, Put, Delete, Authorized, CurrentUser,
  BadRequestError, ForbiddenError, UploadedFile, Post, HttpError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import fs = require('fs');
import {IUser} from '../../../shared/models/IUser';
import {IUserModel, User} from '../models/User';
import {isNullOrUndefined} from 'util';
import {errorCodes} from '../config/errorCodes';

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

function escapeRegex(text: string) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

@JsonController('/users')
@UseBefore(passportJwtMiddleware)
export class UserController {

  /**
   * @api {get} /api/users Request all users
   * @apiName GetUsers
   * @apiGroup User
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {User[]} users List of users.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [
   *         {
   *             "_id": "5a037e6a60f72236d8e7c81d",
   *             "updatedAt": "2018-01-08T19:27:49.483Z",
   *             "createdAt": "2017-11-08T22:00:10.899Z",
   *             "uid": null,
   *             "email": "student1@test.local",
   *             "__v": 0,
   *             "isActive": true,
   *             "role": "student",
   *             "profile": {
   *                 "firstName": "Tick",
   *                 "lastName": "Studi",
   *                 "picture": {
   *                     "alias": "IMG_20141226_211216.jpg",
   *                     "name": "5a037e6a60f72236d8e7c81d-9558.jpg",
   *                     "path": "uploads\\users\\5a037e6a60f72236d8e7c81d-9558.jpg"
   *                 }
   *             },
   *             "id": "5a037e6a60f72236d8e7c81d"
   *         },
   *         {
   *             "uid": null,
   *             "_id": "5a037e6a60f72236d8e7c815",
   *             "updatedAt": "2017-11-08T22:00:10.898Z",
   *             "createdAt": "2017-11-08T22:00:10.898Z",
   *             "email": "teacher2@test.local",
   *             "__v": 0,
   *             "isActive": true,
   *             "role": "teacher",
   *             "profile": {
   *                 "firstName": "Ober",
   *                 "lastName": "Lehrer"
   *             },
   *             "id": "5a037e6a60f72236d8e7c815"
   *         }
   *     ]
   */
  @Get('/')
  @Authorized(['teacher', 'admin'])
  getUsers(@CurrentUser() currentUser?: IUser) {
    return User.find({})
      .then((users) => {
        return users.map((user) => this.cleanUserObject(null, user, currentUser));
      });
  }

  @Get('/members/search') // members/search because of conflict with /:id
  async searchUser(@QueryParam('role') role: string, @QueryParam('query') query: string) {
    if (role !== 'student' && role !== 'teacher') {
      throw new BadRequestError('Method not allowed for this role.');
    }
    query = query.trim();
    if (isNullOrUndefined(query)) {
      throw new BadRequestError(errorCodes.query.empty.code);
    }
    const conditions: any = {};
    const escaped = escapeRegex(query).split(' ');
    conditions.$or = [];
    conditions.$or.push({$text: {$search: query}});
    escaped.forEach(elem => {
      const re = new RegExp(elem, 'ig');
      conditions.$or.push({uid: {$regex: re}});
      conditions.$or.push({email: {$regex: re}});
      conditions.$or.push({'profile.firstName': {$regex: re}});
      conditions.$or.push({'profile.lastName': {$regex: re}})
    });
    const amountUsers = await User.count({}).where({role: role});
    const users = await User.find(conditions, {
      'score': {$meta: 'textScore'}
    })
      .where({role: role})
      .sort({'score': {$meta: 'textScore'}})
      .limit(20);
    return {
      users: users.map((user) => user.toObject({virtuals: true})),
      meta: {
        count: amountUsers
      }
    };
  }

  @Authorized(['admin'])
  @Get('/roles/')
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
          alias: file.originalname,
          size: file.size
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
        if (id === currentUser._id
          && currentUser.role === 'admin'
          && user.role !== 'admin') {
          throw new BadRequestError('You can\'t revoke your own privileges');
        } else {
          return User.find({$and: [{'email': user.email}, {'_id': {$ne: user._id}}]});
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
          if (!(currentUser.role === 'admin' && currentUser._id !== user._id) && !isValidPassword && user.password.length > 0) {
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
