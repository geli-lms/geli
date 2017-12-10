import {
  Authorized,
  Body,
  Get, InternalServerError,
  JsonController,
  Param,
  Put,
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
      return Config.findOneAndUpdate(
        conditions,
        {name: name, configValue: data.data},
        {'upsert': true, 'new': true}
      );
    } catch (error) {
      throw new InternalServerError('something went wrong');
    }
  }
}



