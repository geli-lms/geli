import {Get, JsonController} from 'routing-controllers';
import {APIInfo} from '../models/APIInfo';

@JsonController('/')
export class APIInfoController {

  @Get()
  getDependencies() {
    return new APIInfo('up');
  }
}
