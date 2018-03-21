import {
  Authorized, Body, Delete, Get, JsonController, Post, Param, Put, QueryParam, UseBefore,
  HttpError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {isNullOrUndefined} from 'util';
import {WhitelistUser} from '../models/WhitelistUser';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {errorCodes} from '../config/errorCodes';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

function escapeRegex(text: string) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

@JsonController('/whitelist')
@UseBefore(passportJwtMiddleware)
export class WitelistController {

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
  getUser(@Param('id') id: string) {
    return WhitelistUser.findById(id)
      .populate('progress')
      .then((whitelistUser) => {
        return whitelistUser.toObject({virtuals: true});
      });
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
   * @apiSuccess {WhitelistUser} w Added whitelist user.
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
  @Post('/')
  @Authorized(['teacher', 'admin'])
  addWhitelistUser(@Body() whitelistUser: IWhitelistUser) {
    return new WhitelistUser(this.toMongooseObjectId(whitelistUser)).save()
      .then((w) => w.toObject());
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
   * @apiSuccess {WhitelistUser} w Updated whitelist user.
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
   */
  @Put('/:id')
  @Authorized(['teacher', 'admin'])
  updateWhitelistUser(@Param('id') id: string, @Body() whitelistUser: IWhitelistUser) {
    return WhitelistUser.findOneAndUpdate(
      this.toMongooseObjectId(whitelistUser),
      {'new': true}
    )
      .then((w) => w ? w.toObject({}) : undefined);
  }

  /**
   * @api {delete} /api/whitelist/:id Delete whitelist user
   * @apiName DeleteWhitelistUser
   * @apiGroup Whitelist
   * @apiPermission teacher
   * @apiPermission admin
   *
   * @apiParam {String} id Whitelist user ID.
   *
   * @apiSuccess {Object} deletion Object with deleted whitelist user.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "$__": {...},
   *         "isNew": false,
   *         "_doc": {
   *             "__v": 0,
   *             "courseId": {...},
   *             "uid": "876543",
   *             "lastName": "mustermann",
   *             "firstName": "max",
   *             "createdAt": "2018-03-21T23:22:23.758Z",
   *             "updatedAt": "2018-03-21T23:22:23.758Z",
   *             "_id": {...}
   *         },
   *         "$init": true
   *     }
   */
  @Delete('/:id')
  @Authorized(['teacher', 'admin'])
  deleteWhitelistUser(@Param('id') id: string) {
    return WhitelistUser.findByIdAndRemove(id);
  }

  toMongooseObjectId(whitelistUser: IWhitelistUser) {
    return {
      _id: whitelistUser._id,
      firstName: whitelistUser.firstName,
      lastName: whitelistUser.lastName,
      uid: whitelistUser.uid,
      courseId: new ObjectId(whitelistUser.courseId)
    }
  }
}
