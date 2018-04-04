import {Get, JsonController} from 'routing-controllers';
import {APIInfo} from '../models/APIInfo';

@JsonController('/')
export class APIInfoController {

  /**
   * @api {get} /api/ Request API info
   * @apiName GetDependencies
   * @apiGroup API
   *
   * @apiSuccess {String} status API status.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "status": "up"
   *     }
   */
  @Get()
  getDependencies() {
    return new APIInfo('up');
  }
}
