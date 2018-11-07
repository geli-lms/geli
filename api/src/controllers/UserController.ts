import {
  Body, JsonController, UseBefore, Get, Param, QueryParam, Put, Delete, Authorized, CurrentUser,
  BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UploadedFile, Post
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import * as fs from 'fs';
import * as path from 'path';
import {IUser} from '../../../shared/models/IUser';
import {User} from '../models/User';
import {isNullOrUndefined} from 'util';
import {errorCodes} from '../config/errorCodes';
import * as sharp from 'sharp';
import config from '../config/main';
import {Course} from '../models/Course';
import emailService from '../services/EmailService';

const multer = require('multer');

const uploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, path.join(config.uploadFolder, 'users'));
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
   * @api {get} /api/users/ Request all users
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
   *             "uid": "123456",
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
  async getUsers(@CurrentUser() currentUser: IUser) {
    const users = await User.find();
    return users.map(user => user.forUser(currentUser));
  }

  /**
   * @api {get} /api/users/members/search Request users with certain role and query
   * @apiName SearchUser
   * @apiGroup User
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String="student","teacher"} role User role.
   * @apiParam {String} query Query string.
   * @apiParam {Number} limit Limit.
   *
   * @apiSuccess {Object} result Search result.
   * @apiSuccess {User[]} result.users List of found users.
   * @apiSuccess {Object} result.meta Meta data.
   * @apiSuccess {Number} meta.count Number of users with given role.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "users": [
   *             {
   *                 "_id": "5a037e6a60f72236d8e7c81d",
   *                 "updatedAt": "2018-01-08T19:27:49.483Z",
   *                 "createdAt": "2017-11-08T22:00:10.899Z",
   *                 "uid": "123456",
   *                 "email": "student1@test.local",
   *                 "__v": 0,
   *                 "score": 1.1,
   *                 "isActive": true,
   *                 "role": "student",
   *                 "profile": {
   *                     "firstName": "Tick",
   *                     "lastName": "Studi",
   *                     "picture": {
   *                         "alias": "IMG_20141226_211216.jpg",
   *                         "name": "5a037e6a60f72236d8e7c81d-9558.jpg",
   *                         "path": "uploads\\users\\5a037e6a60f72236d8e7c81d-9558.jpg"
   *                     }
   *                 },
   *                 "id": "5a037e6a60f72236d8e7c81d"
   *             },
   *             {
   *                 "_id": "5a037e6a60f72236d8e7c81f",
   *                 "updatedAt": "2017-11-08T22:00:10.900Z",
   *                 "createdAt": "2017-11-08T22:00:10.900Z",
   *                 "uid": "345678",
   *                 "email": "student3@test.local",
   *                 "__v": 0,
   *                 "score": 1.1,
   *                 "isActive": true,
   *                 "role": "student",
   *                 "profile": {
   *                     "firstName": "Track",
   *                     "lastName": "Studi"
   *                 },
   *                 "id": "5a037e6a60f72236d8e7c81f"
   *             },
   *             {
   *                 "_id": "5a037e6a60f72236d8e7c81e",
   *                 "updatedAt": "2017-11-08T22:00:10.900Z",
   *                 "createdAt": "2017-11-08T22:00:10.900Z",
   *                 "uid": "234567",
   *                 "email": "student2@test.local",
   *                 "__v": 0,
   *                 "score": 1.1,
   *                 "isActive": true,
   *                 "role": "student",
   *                 "profile": {
   *                     "firstName": "Trick",
   *                     "lastName": "Studi"
   *                 },
   *                 "id": "5a037e6a60f72236d8e7c81e"
   *             }
   *         ],
   *         "meta": {
   *             "count": 31
   *         }
   *     }
   *
   * @apiError BadRequestError Method not allowed for this role.
   * @apiError BadRequestError Query was empty.
   */
  @Get('/members/search') // members/search because of conflict with /:id
  @Authorized(['teacher', 'admin'])
  async searchUser(
      @CurrentUser() currentUser: IUser, @QueryParam('role') role: string,
      @QueryParam('query') query: string, @QueryParam('limit') limit?: number) {
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
      conditions.$or.push({'profile.lastName': {$regex: re}});
    });
    const amountUsers = await User.countDocuments({role: role});
    const users = await User.find(conditions, {
      'score': {$meta: 'textScore'}
    })
      .where({role: role})
      .limit(limit ? limit : Number.MAX_SAFE_INTEGER)
      .sort({'score': {$meta: 'textScore'}});
    return {
      users: users.map(user => user.forUser(currentUser)),
      meta: {
        count: amountUsers
      }
    };
  }

  /**
   * @api {get} /api/users/roles/ Request all user roles
   * @apiName GetUserRoles
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiSuccess {String[]} roles List of user roles.
   *
   * @apiSuccessExample {json} Success-Response:
   *     [
   *         "student",
   *         "teacher",
   *         "admin"
   *     ]
   */
  @Authorized(['admin'])
  @Get('/roles/')
  getRoles() {
    // TODO: Fix any cast
    return (<any>User.schema.path('role')).enumValues;
  }

  /**
   * @api {get} /api/users/:id Request user with certain ID
   * @apiName GetUser
   * @apiGroup User
   *
   * @apiParam {String} id User ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {User} user User.
   *
   * @apiError NotFoundError User was not found.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6a60f72236d8e7c81d",
   *         "updatedAt": "2018-01-08T19:27:49.483Z",
   *         "createdAt": "2017-11-08T22:00:10.899Z",
   *         "uid": "123456",
   *         "email": "student1@test.local",
   *         "__v": 0,
   *         "isActive": true,
   *         "role": "student",
   *         "profile": {
   *             "firstName": "Tick",
   *             "lastName": "Studi",
   *             "picture": {
   *                 "alias": "IMG_20141226_211216.jpg",
   *                 "name": "5a037e6a60f72236d8e7c81d-9558.jpg",
   *                 "path": "uploads\\users\\5a037e6a60f72236d8e7c81d-9558.jpg"
   *             }
   *         },
   *         "id": "5a037e6a60f72236d8e7c81d"
   *     }
   */
  @Get('/:id([a-fA-F0-9]{24})')
  async getUser(@Param('id') id: string, @CurrentUser() currentUser?: IUser) {
    const user = await User.findById(id).populate('progress');

    if (!user) {
      throw new NotFoundError(`User was not found.`);
    }
    return user.forUser(currentUser);
  }

  /**
   * @api {post} /api/users/picture/:id Add picture to user profile
   * @apiName PostUserPicture
   * @apiGroup User
   *
   * @apiParam {Object} file Uploaded file.
   * @apiParam {String} id User target ID.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {User} user Affected user.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6a60f72236d8e7c81d",
   *         "updatedAt": "2018-01-08T19:27:49.483Z",
   *         "createdAt": "2017-11-08T22:00:10.899Z",
   *         "uid": "123456",
   *         "email": "student1@test.local",
   *         "__v": 0,
   *         "isActive": true,
   *         "role": "student",
   *         "profile": {
   *             "firstName": "Tick",
   *             "lastName": "Studi",
   *             "picture": {
   *                 "alias": "IMG_20141226_211216.jpg",
   *                 "name": "5a037e6a60f72236d8e7c81d-9558.jpg",
   *                 "path": "uploads\\users\\5a037e6a60f72236d8e7c81d-9558.jpg"
   *             }
   *         },
   *         "id": "5a037e6a60f72236d8e7c81d"
   *     }
   *
   * @apiError ForbiddenError Forbidden format of uploaded picture.
   * @apiError ForbiddenError You don't have the authorization to change a user of this role.
   * @apiError BadRequestError
   */
  @Post('/picture/:id')
  async addUserPicture(
      @UploadedFile('file', {options: uploadOptions}) file: any,
      @Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const mimeFamily = file.mimetype.split('/', 1)[0];
    if (mimeFamily !== 'image') {
      throw new ForbiddenError('Forbidden format of uploaded picture: ' + mimeFamily);
    }

    let user = await User.findById(id);

    if (!user.checkEditableBy(currentUser).editAllowed) {
      throw new ForbiddenError(errorCodes.user.cantChangeUserWithHigherRole.text);
    }

    if (user.profile.picture) {
      const oldPicturePath = user.profile.picture.path;
      if (oldPicturePath && fs.existsSync(oldPicturePath)) {
        fs.unlinkSync(oldPicturePath);
      }
    }

    const resizedImageBuffer =
        await sharp(file.path)
            .resize(config.maxProfileImageWidth, config.maxProfileImageHeight, {fit: 'inside', withoutEnlargement: true})
            .toBuffer({resolveWithObject: true});

    fs.writeFileSync(file.path, resizedImageBuffer.data);

    user.profile.picture = {
      _id: null,
      name: file.filename,
      alias: file.originalname,
      path: path.relative(path.dirname(config.uploadFolder), file.path).replace(/\\\\?/g, '/'),
      size: resizedImageBuffer.info.size
    };

    try {
      user = await user.save();
    } catch (error) {
      throw new BadRequestError(error);
    }

    return user.forUser(currentUser);
  }

  /**
   * @api {put} /api/users/:id Update user
   * @apiName PutUser
   * @apiGroup User
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id User target ID.
   * @apiParam {Object} newUser New user data.
   * @apiParam {IUser} currentUser Currently logged in user.
   *
   * @apiSuccess {User} user Updated user.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "_id": "5a037e6a60f72236d8e7c81d",
   *         "updatedAt": "2018-01-08T19:27:49.483Z",
   *         "createdAt": "2017-11-08T22:00:10.899Z",
   *         "uid": "123456",
   *         "email": "student1@test.local",
   *         "__v": 0,
   *         "isActive": true,
   *         "role": "student",
   *         "profile": {
   *             "firstName": "Tick",
   *             "lastName": "Studi",
   *             "picture": {
   *                 "alias": "IMG_20141226_211216.jpg",
   *                 "name": "5a037e6a60f72236d8e7c81d-9558.jpg",
   *                 "path": "uploads\\users\\5a037e6a60f72236d8e7c81d-9558.jpg"
   *             }
   *         },
   *         "id": "5a037e6a60f72236d8e7c81d"
   *     }
   *
   * @apiError BadRequestError Invalid update role.
   * @apiError BadRequestError You can't change your own role.
   * @apiError BadRequestError This email address is already in use.
   * @apiError BadRequestError Invalid current password!
   * @apiError ForbiddenError You don't have the authorization to change a user of this role.
   * @apiError ForbiddenError Only users with admin privileges can change roles.
   * @apiError ForbiddenError Only users with admin privileges can change uids.
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() newUser: any, @CurrentUser() currentUser: IUser) {
    if (id === currentUser._id && currentUser.role !== newUser.role) {
      throw new BadRequestError(errorCodes.user.cantChangeOwnRole.text);
    }

    const oldUser = await User.findById(id);
    const {userIsAdmin, editAllowed} = oldUser.checkEditableBy(currentUser);

    if (!editAllowed) {
      throw new ForbiddenError(errorCodes.user.cantChangeUserWithHigherRole.text);
    }

    if (oldUser.uid && newUser.uid === null) {
      newUser.uid = oldUser.uid;
    }
    if (oldUser.role && typeof newUser.role === 'undefined') {
      newUser.role = oldUser.role;
    } else if (typeof User.getEditLevelUnsafe(newUser) === 'undefined') {
      throw new BadRequestError(errorCodes.user.invalidNewUserRole.text);
    }

    if (!userIsAdmin) {
      if (newUser.role !== oldUser.role) {
        throw new ForbiddenError(errorCodes.user.onlyAdminsCanChangeRoles.text);
      }
      if (newUser.uid !== oldUser.uid) {
        throw new ForbiddenError(errorCodes.user.onlyAdminsCanChangeUids.text);
      }
    }

    if (typeof newUser.password === 'undefined' || newUser.password.length === 0) {
      delete newUser.password;
    } else {
      const isValidPassword = await oldUser.isValidPassword(newUser.currentPassword);
      if (!isValidPassword) {
        throw new BadRequestError(errorCodes.user.invalidPassword.text);
      }
    }

    {
      const sameEmail = {$and: [{'email': newUser.email}, {'_id': {$ne: newUser._id}}]};
      const users = await User.find(sameEmail).limit(1);
      if (users.length > 0) {
        throw new BadRequestError(errorCodes.user.emailAlreadyInUse.text);
      }
    }

    const updatedUser = await User.findOneAndUpdate({_id: id}, newUser, {new: true});
    return updatedUser.forUser(currentUser);
  }

  /**
   * @api {delete} /api/users/:id Delete user
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission student
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id User ID.
   *
   * @apiSuccess {Boolean} result Confirmation of deletion.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "result": true
   *     }
   *
   * @apiError BadRequestError There are no other users with admin privileges.
   */
  @Authorized(['student', 'teacher', 'admin'])
  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const otherAdmin = await User.findOne({$and: [{'role': 'admin'}, {'_id': {$ne: id}}]});

    if (id === currentUser._id && (currentUser.role === 'teacher' || currentUser.role === 'student')) {
      try {
        emailService.sendDeleteRequest(currentUser, otherAdmin);
      } catch (err) {
        throw new InternalServerError(errorCodes.mail.notSend.code);
      }
      return {result: true};
    }

    if (id === currentUser._id && currentUser.role === 'admin') {
      if (otherAdmin === null) {
        throw new BadRequestError(errorCodes.user.noOtherAdmins.text);
      }
    } else if (id !== currentUser._id && currentUser.role !== 'admin') {
      throw new BadRequestError(errorCodes.user.cantDeleteOtherUsers.text);
    }

    const user = await User.findById(id);

    if (id === currentUser._id) {
      // if user is current user, move ownership to another admin.
      await Course.changeCourseAdminFromUser(user, otherAdmin);
    } else {
      // move Courseownerships to active user.
      await Course.changeCourseAdminFromUser(user, currentUser);
    }

    await user.remove();

    return {result: true};
  }
}
