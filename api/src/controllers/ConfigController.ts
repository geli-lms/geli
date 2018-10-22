import {
  JsonController,
  UseBefore, Authorized,
  Param, BodyParam,
  Get, Put,
  UnauthorizedError
} from 'routing-controllers';
import {Config} from '../models/Config';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

function isPublicConfig(name: string) {
  return /^legalnotice$|^infoBox$|^privacy$|^downloadMaxFileSize$/.test(name);
}

@JsonController('/config')
export class ConfigController {

  private async findConfig(name: string) {
    const config = await Config.findOne({name});
    return config ? config.toObject() : {name, value: ''};
  }

  /**
   * @api {get} /api/config/public/:id Request public config
   * @apiName GetConfigPublic
   * @apiGroup Config
   *
   * @apiParam {String} id Config name (e.g. legalnotice).
   *
   * @apiSuccess {Config} config Public config.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "name": "legalnotice",
   *         "value": "This will show the legalnotice.",
   *         "updatedAt": "2017-11-08T22:00:11.693Z",
   *         "createdAt": "2017-11-08T22:00:11.693Z",
   *         "__v": 0
   *     }
   *
   * @apiError UnauthorizedError
   */
  @Get('/public/:id')
  getPublicConfig(@Param('id') name: string) {
    if (!isPublicConfig(name)) {
      throw new UnauthorizedError('');
    }
    return this.findConfig(name);
  }

  /**
   * @api {put} /api/config/:id Update config
   * @apiName PutConfig
   * @apiGroup Config
   * @apiPermission admin
   *
   * @apiParam {String} id Config name (e.g. legalnotice).
   * @apiParam {Object} data New data (with single 'data' string property).
   *
   * @apiSuccess {Object} result Empty object.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {}
   *
   */
  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  @Put('/:id')
  async putConfig(@Param('id') name: string, @BodyParam('data') value: string) {
    await Config.findOneAndUpdate(
      {name},
      {name, value},
      {'upsert': true, 'new': true}
    );
    return {};
  }

  /**
   * @api {get} /api/config/:id Request config
   * @apiName GetConfig
   * @apiGroup Config
   * @apiPermission admin
   *
   * @apiParam {String} id Config name (e.g. legalnotice).
   *
   * @apiSuccess {Config} config Config.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "name": "legalnotice",
   *         "value": "This will show the legalnotice.",
   *         "updatedAt": "2017-11-08T22:00:11.693Z",
   *         "createdAt": "2017-11-08T22:00:11.693Z",
   *         "__v": 0
   *     }
   *
   */
  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  @Get('/:id')
  getConfig(@Param('id') name: string) {
    return this.findConfig(name);
  }
}
