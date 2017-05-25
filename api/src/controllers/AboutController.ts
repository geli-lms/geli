import {Get, JsonController} from 'routing-controllers';
import * as fs from 'fs-extra';

@JsonController('/about')
export class AboutController {

  @Get('/dependencies')
  getDependencies() {
    return fs.readFile('nlf-licenses.json')
      .then((data) => {
        return data;
      });
  }
}
