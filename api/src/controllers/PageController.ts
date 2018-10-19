import {Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, Put, UseBefore} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IUser} from '../../../shared/models/IUser';
import {IPageModel, Page} from '../models/Page';

@JsonController('/pages')
export class PageController {

  @Get('/')
  async getPages() {
    const pages = await Page.find();
    return pages.map((page) => page.toObject());
  }

  @Get('/detail/:path')
  async getPage(@Param('path') path: string, @CurrentUser() currentUser: IUser) {
    const accessedPage = await Page.findOne({'path': path});
    return accessedPage.toObject();
  }

  @Post('/')
  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  async addPage(@Body() data: any) {
    try {
      const page = await Page.create(data);
      return page.toObject();
    } catch (error) {
      const debug = error;
    }
  }

  @Put('/:path')
  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  async  updatePage() {
    return new BadRequestError('Not implemented');
  }
}
