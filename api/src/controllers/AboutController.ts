import {Get, HttpError, JsonController} from 'routing-controllers';
import * as fs from 'fs-extra';

@JsonController('/about')
export class AboutController {

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
