import {Request} from 'express';
import {
  Authorized, BadRequestError,
  Body,
  CurrentUser, Delete, ForbiddenError,
  Get, InternalServerError,
  JsonController, NotFoundError,
  Param,
  Post,
  Put,
  Req, UnauthorizedError,
  UploadedFile,
  UseBefore
} from 'routing-controllers';
import {Config} from '../models/Config';
import passportJwtMiddleware from '../security/passportJwtMiddleware';


@JsonController('/config')

export class ConfigController {
  @Get('/imprint')
  async getImprint() {
    try {
      const imprint = await Config.findOne({name: 'imprint'});
      if (!imprint) {
        return {name: 'imprint', configValue: ''};
      }
      return imprint.toObject();
    } catch (error) {
      throw new InternalServerError('');
    }
  }

  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  @Put('/:id')
  async setImprint(@Param('id') name: string, @Body() data: any) {
    const conditions: any = {name: name};
    try {
      const config = Config.findOneAndUpdate(
        conditions,
        {name: name, configValue: data.data},
        {'upsert': true, 'new': true}
      );
      return config;
    } catch (error) {
      throw new InternalServerError('something went wrong');
    }
  }
}



