import {Get, JsonController} from 'routing-controllers';
import {Info} from '../models/Info';

@JsonController('/')
export class AboutController {

  @Get()
  getDependencies() {
    return new Info('up');
  }
}
