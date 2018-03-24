import {Get, HttpError, JsonController} from 'routing-controllers';
import * as fs from 'fs-extra';

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
  getDependencies() {
    return fs.readJson('nlf-licenses.json')
      .then((data) => {
        if (typeof data.name !== 'undefined' && data.name === 'Error') {
          return new HttpError(500, 'Licensefile not found');
        }
        return data;
      })
      .catch(() => {
        return new HttpError(500, 'Licensefile not found');
      });
  }
}
