import {
  Authorized,
  BodyParam,
  Get, InternalServerError,
  JsonController,
  Param,
  Put, UnauthorizedError,
  UseBefore
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
   *         "name":"legalnotice",
   *         "updatedAt": "2018-03-20T21:04:41.696Z",
   *         "value":"This will show the legalnotice.",
   *         "__v": 0,
   *         "createdAt": "2018-03-20T21:04:41.696Z"
   *     }
   *
   * @apiError InternalServerError
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
   * @apiParam {Object} data New data.
   *
   * @apiSuccess {Config} config Updated config.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "$__": {
   *             "strictMode": true,
   *             "selected": {},
   *             "getters": {},
   *             "_id": {...},
   *             "wasPopulated": false,
   *             "activePaths": {...},
   *             "pathsToScopes": {},
   *             "emitter": {...},
   *             "$options": true
   *         },
   *         "isNew": false,
   *         "_doc": {
   *             "createdAt": "2018-03-20T21:04:41.696Z",
   *             "__v": 0,
   *             "value": "This will show the legalnotice.",
   *             "updatedAt": "2018-03-20T21:04:41.696Z",
   *             "name": "legalnotice",
   *             "_id": {...}
   *         },
   *         "$init": true
   *     }
   *
   * @apiError InternalServerError something went wrong
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
   *         "name":"legalnotice",
   *         "updatedAt": "2018-03-20T21:04:41.696Z",
   *         "value":"This will show the legalnotice.",
   *         "__v": 0,
   *         "createdAt": "2018-03-20T21:04:41.696Z"
   *     }
   *
   * @apiError InternalServerError
   */
  @UseBefore(passportJwtMiddleware)
  @Authorized(['admin'])
  @Get('/:id')
  getConfig(@Param('id') name: string) {
    return this.findConfig(name);
  }
}
