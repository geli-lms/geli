import {Authorized, Body, Delete, Get, JsonController, Post, Param, Put, QueryParam, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {isNullOrUndefined} from 'util';
import {WhitelistUser} from '../models/WhitelistUser';
import {IWhitelistUser} from '../../../shared/models/IWhitelistUser';

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
      throw Error('No given query.');
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

  @Get('/count')
  @Authorized(['teacher', 'admin'])
  searchCountUsers() {
    return WhitelistUser.count({});
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
