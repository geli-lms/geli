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

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return WhitelistUser.findById(id)
      .populate('progress')
      .then((whitelistUser) => {
        return whitelistUser.toObject({virtuals: true});
      });
  }

  @Get('/:id/count')
  @Authorized(['teacher', 'admin'])
  searchCountUsers(@Param('id') id: string) {
    return WhitelistUser.count({courseId: id});
  }

  @Post('/')
  @Authorized(['teacher', 'admin'])
  addWhitelistUser(@Body() whitelistUser: IWhitelistUser) {
    return new WhitelistUser(this.toMongooseObjectId(whitelistUser)).save()
      .then((w) => w.toObject());
  }

  @Put('/:id')
  @Authorized(['teacher', 'admin'])
  updateWhitelistUser(@Param('id') id: string, @Body() whitelistUser: IWhitelistUser) {
    return WhitelistUser.findOneAndUpdate(
      this.toMongooseObjectId(whitelistUser),
      {'new': true}
    )
      .then((w) => w ? w.toObject({}) : undefined);
  }

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
