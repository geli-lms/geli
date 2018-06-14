import {
  Authorized,
  Body,
  Get, InternalServerError,
  JsonController,
  Param,
  Put, UnauthorizedError,
  UseBefore
} from 'routing-controllers';
import {Config} from '../models/Config';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

const publicConfigs = [
  new RegExp('legalnotice|infoBox|privacy'),
  new RegExp('downloadMaxFileSize')
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



