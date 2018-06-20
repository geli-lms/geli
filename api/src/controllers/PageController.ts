import {Authorized, CurrentUser, Get, JsonController, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IUser} from '../../../shared/models/IUser';

@JsonController('/page')
export class PageController {

  @Get('/')
  async getPages(@CurrentUser() currentUser: IUser) {
  }

  @Get('/:key')
  async getPage(@Param('key') key: string, @CurrentUser() currentUser: IUser) {}

  @Post('/')
  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  async addPage() {}

  @Put('/:key')
  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  async  updatePage() {}
}
