import {
  Authorized, Body, Delete, Get, JsonController, Post, Param, Put, QueryParam, UseBefore,
  HttpError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {isNullOrUndefined} from 'util';
import {WhitelistUser} from '../models/WhitelistUser';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';
import {errorCodes} from '../config/errorCodes';

function escapeRegex(text: string) {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

@JsonController('/whitelist')
@UseBefore(passportJwtMiddleware)
export class WitelistController {

  // TODO: Needs more security
  @Get('/:id/search/')
  @Authorized(['teacher', 'admin'])
  searchUser(@Param('id') id: string, @QueryParam('query') query: string) {
    query = query.trim();
    if (isNullOrUndefined(query) || query.length <= 0) {
      throw new HttpError(400, errorCodes.query.empty.code);
    }
    const conditions: any = {};
    const escaped = escapeRegex(query).split(' ');
    conditions.$or = [];
    conditions.$and = [];
    conditions.$and.push({courseId: id});
    conditions.$or.push({$text: {$search: query}});
    escaped.forEach(elem => {
      const re = new RegExp(elem, 'ig');
      conditions.$or.push({uid: {$regex: re}});
      conditions.$or.push({firstName: {$regex: re}});
      conditions.$or.push({lastName: {$regex: re}})
    });
    return WhitelistUser.find(conditions, {score: {$meta: 'textScore'}})
      .sort({score: {$meta: 'textScore'}})
      .limit(20).then(users => {
        return users.map((user) => user.toObject({virtuals: true}));
      });
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return WhitelistUser.findById(id)
      .populate('progress')
      .then((whitelistUser) => {
        return whitelistUser.toObject({virtuals: true});
      });
  }

  @Get('/course/:id')
  @Authorized(['teacher', 'admin'])
  getUsers(@Param('id') id: string) {
    return WhitelistUser.find({courseId: id})
      .then((whitelistUsers) => {
        return whitelistUsers.map((user) => user.toObject({virtuals: true}));
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
    return new WhitelistUser(whitelistUser).save()
      .then((w) => w.toObject());
  }

  @Put('/:id')
  @Authorized(['teacher', 'admin'])
  updateWhitelistUser(@Param('id') id: string, @Body() whitelistUser: IWhitelistUser) {
    return WhitelistUser.findOneAndUpdate(
      whitelistUser,
      {'new': true}
    )
      .then((w) => w ? w.toObject({}) : undefined);
  }

  @Delete('/:id')
  @Authorized(['teacher', 'admin'])
  deleteWhitelistUser(@Param('id') id: string) {
    return WhitelistUser.findByIdAndRemove(id);
  }
}
