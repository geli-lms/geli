import {
  Authorized,
  Body,
  Get, InternalServerError,
  JsonController, NotFoundError,
  Param,
  Put, UnauthorizedError,
  UseBefore
} from 'routing-controllers';
import {Config} from '../models/Config';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import config from '../config/main'

const publicConfigs = [
  new RegExp('imprint')
];

function publicConfig(id: string) {
  for (const item of publicConfigs) {
    if (id.match(item)) {
      return true;
    }
  }
  return false;
}

@JsonController('/config')
export class ConfigController {

  @Get('/public/:id')
  async getPublicConfig(@Param('id') name: string) {
    if (publicConfig(name)) {
      try {
        const configV = await Config.findOne({name: name});
        if (!configV) {
          return {name: name, value: ''};
        }
        return configV.toObject();
      } catch (error) {
        throw new InternalServerError('');
      }
    } else {
      throw new UnauthorizedError('');
    }
  }

  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  @Put('/:id')
  async setImprint(@Param('id') name: string, @Body() data: any) {
    const conditions: any = {name: name};
    try {
      return Config.findOneAndUpdate(
        conditions,
        {name: name, value: data.data},
        {'upsert': true, 'new': true}
      );
    } catch (error) {
      throw new InternalServerError('something went wrong');
    }
  }

  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  @Get('/:id')
  async getConfig(@Param('id') name: string) {
    try {
      const configV = await Config.findOne({name: name});
      if (!configV) {
        return {name: name, value: ''};
      }
      return configV.toObject();
    } catch (error) {
      throw new InternalServerError('');
    }
  }
}



