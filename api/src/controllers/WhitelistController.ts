import {Get, Post, Delete, Authorized, Param, Body, CurrentUser,
  UseBefore, JsonController, BadRequestError, ForbiddenError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {WhitelistUser} from '../models/WhitelistUser';
import {errorCodes} from '../config/errorCodes';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import {Course} from '../models/Course';
import {User} from '../models/User';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/whitelist')
@UseBefore(passportJwtMiddleware)
export class WhitelistController {

  /**
   * @api {get} /api/whitelist/check/:whitelist
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *  [
   *    {
   *        "uid": "<uid>",
   *        "exists": true
   *    },
   *    {
   *        "uid": "<non-existing-uid>",
   *        "exists": false
   *    }
   *  ]
   * @apiParam whitelistToCheck
   */
  @Get('/check/:whitelist')
  @Authorized(['teacher', 'admin'])
  async checkWhitelistForExistingStudents(@Param('whitelist') whitelistToCheck: any[]) {

    return await Promise.all(
      whitelistToCheck.map(async uid => { {
        return { uid, exists: !!(await User.findOne({ uid: uid }))};
      }})
    );
  }

  /**
   * @api {get} /api/whitelist/:id Request whitelist user
   * @apiName GetWhitelistUser
   * @apiGroup Whitelist
   *
   * @apiParam {String} id Whitelist user ID.
   *
   * @apiSuccess {WhitelistUser} whitelistUser Whitelist user.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "__v": 0,
   *         "updatedAt": "2018-03-21T23:22:23.758Z",
   *         "createdAt": "2018-03-21T23:22:23.758Z",
   *         "_id": "5ab2e92fda32ac2ab0f04b78",
   *         "firstName": "max",
   *         "lastName": "mustermann",
   *         "uid": "876543",
   *         "courseId": {...},
   *         "id": "5ab2e92fda32ac2ab0f04b78"
   *     }
   */
  @Get('/:id')
  @Authorized(['teacher', 'admin'])
  async getUser(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const whitelistUser = await WhitelistUser.findById(id);
    const course = await Course.findById(whitelistUser.courseId);
    if (!course.checkPrivileges(currentUser).userCanEditCourse) {
      throw new ForbiddenError();
    }

    return whitelistUser.toObject({virtuals: true});
  }

  /**
   * @api {post} /api/whitelist/ Add whitelist user
   * @apiName PostWhitelistUser
   * @apiGroup Whitelist
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {IWhitelistUser} whitelistUser New whitelist user.
   *
   * @apiSuccess {WhitelistUser} savedWhitelistUser Added whitelist user.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "__v": 0,
   *         "updatedAt": "2018-03-21T23:22:23.758Z",
   *         "createdAt": "2018-03-21T23:22:23.758Z",
   *         "_id": "5ab2e92fda32ac2ab0f04b78",
   *         "firstName": "max",
   *         "lastName": "mustermann",
   *         "uid": "876543",
   *         "courseId": {...},
   *         "id": "5ab2e92fda32ac2ab0f04b78"
   *     }
   *
   * @apiError BadRequestError That matriculation number is already in use for this course.
   */
  @Post('/')
  @Authorized(['teacher', 'admin'])
  async addWhitelistUser(@Body() whitelistUser: IWhitelistUser, @CurrentUser() currentUser: IUser) {
    const course = await Course.findById(whitelistUser.courseId);
    if (!course.checkPrivileges(currentUser).userCanEditCourse) {
      throw new ForbiddenError();
    }

    let savedWhitelistUser;
    try {
      savedWhitelistUser = await new WhitelistUser(this.prepareWhitelistUserData(whitelistUser)).save();
    } catch (err) {
      throw new BadRequestError(errorCodes.whitelist.duplicateWhitelistUser.text);
    }
    await this.addUserIfFound(whitelistUser);
    return savedWhitelistUser.toObject();
  }

  /**
   * @api {put} /api/whitelist/:id Update whitelist user
   * @apiName PutWhitelistUser
   * @apiGroup Whitelist
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Whitelist user ID.
   * @apiParam {IWhitelistUser} whitelistUser New whitelist user.
   *
   * @apiSuccess {WhitelistUser} updatedWhitelistUser Updated whitelist user.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "__v": 0,
   *         "updatedAt": "2018-03-21T23:24:56.758Z",
   *         "createdAt": "2018-03-21T23:22:23.758Z",
   *         "_id": "5ab2e92fda32ac2ab0f04b78",
   *         "firstName": "maximilian",
   *         "lastName": "mustermann",
   *         "uid": "876543",
   *         "courseId": {...},
   *         "id": "5ab2e92fda32ac2ab0f04b78"
   *     }
   *
   * @apiError BadRequestError That matriculation number is already in use for this course.
   */
  // This route has been disabled since it appears to be unused and insufficiently secured.
  /*
  @Put('/:id')
  @Authorized(['teacher', 'admin'])
  async updateWhitelistUser(@Param('id') id: string, @Body() whitelistUser: IWhitelistUser) {
    let updatedWhitelistUser;
    const foundWhitelistUser = await WhitelistUser.findById(id);
    try {
      updatedWhitelistUser = await WhitelistUser.findOneAndUpdate(
        this.prepareWhitelistUserData(whitelistUser),
        {'new': true});
    } catch (err) {
      throw new BadRequestError(errorCodes.whitelist.duplicateWhitelistUser.text);
    }
    await this.deleteUserIfFound(foundWhitelistUser);
    await this.addUserIfFound(updatedWhitelistUser);
    return updatedWhitelistUser ? updatedWhitelistUser.toObject() : undefined;
  }
  */

  /**
   * @api {delete} /api/whitelist/:id Delete whitelist user
   * @apiName DeleteWhitelistUser
   * @apiGroup Whitelist
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Whitelist user ID.
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {}
   */
  @Delete('/:id')
  @Authorized(['teacher', 'admin'])
  async deleteWhitelistUser(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const whitelistUser = await WhitelistUser.findById(id);
    const course = await Course.findById(whitelistUser.courseId);
    if (!course.checkPrivileges(currentUser).userCanEditCourse) {
      throw new ForbiddenError();
    }

    await WhitelistUser.deleteOne({_id: id});
    await this.deleteUserIfFound(whitelistUser);
    return {};
  }

  private async deleteUserIfFound(whitelistUser: IWhitelistUser) {
    const course = await Course.findById(whitelistUser.courseId).populate('students');
    if (course) {
      course.students = course.students.filter(stud => stud.uid.toString() !== whitelistUser.uid);
      await course.save();
    }
  }

  private async addUserIfFound(whitelistUser: IWhitelistUser) {
    const stud = await User.findOne({
        uid: whitelistUser.uid,
        'profile.firstName': { $regex: new RegExp('^' + whitelistUser.firstName.toLowerCase(), 'i')},
        'profile.lastName': { $regex: new RegExp('^' + whitelistUser.lastName.toLowerCase(), 'i')}
      });
    if (stud) {
      const course = await Course.findById(whitelistUser.courseId);
      course.students.push(stud);
      await course.save();
    }
  }

  prepareWhitelistUserData(whitelistUser: IWhitelistUser) {
    return {
      _id: whitelistUser._id,
      firstName: whitelistUser.firstName,
      lastName: whitelistUser.lastName,
      uid: whitelistUser.uid,
      courseId: new ObjectId(whitelistUser.courseId)
    };
  }
}
