import {ContentType, Get, HttpError, JsonController} from 'routing-controllers';
import * as fs from 'fs';

@JsonController('/about')
export class AboutController {

  /**
   * @api {get} /api/about/dependencies Request dependencies
   * @apiName GetAboutDependencies
   * @apiGroup About
   *
   * @apiSuccess {Object[]} data Information about dependencies.
   *
   * @apiSuccessExample {json} Success-Response:
   *     {
   *         "data": [{
   *             "name": "bcrypt",
   *             "version": "1.0.3",
   *             "repository": "https://github.com/kelektiv/node.bcrypt.js",
   *             "license": "MIT",
   *             "devDependency": false
   *         }, {
   *             "name": "express",
   *             "version": "4.16.2",
   *             "repository": "https://github.com/expressjs/express",
   *             "devDependency": false
   *         }, {
   *             "name": "winston",
   *             "version": "2.4.0",
   *             "repository": "https://github.com/winstonjs/winston",
   *             "license": "MIT",
   *             "devDependency": false
   *         }]
   *     }
   *
   * @apiError HttpError 500 - Licensefile not found
   */
  @Get('/dependencies')
  @ContentType('application/json')
  async getDependencies() {
    try {
      return await fs.readFileSync('nlf-licenses.json');
    } catch (err) {
      throw new HttpError(500, 'Licensefile not found');
    }
  }
}
