import {
  Body,
  Get,
  JsonController, Post,
} from 'routing-controllers';
import {Course} from '../models/Course';


@JsonController('/test')
export class TestController {

  @Get('/')
  testget() {
    return Course.findOne({name: 'Introduction to web development'})
      .then((course) => course.export());
  }

  @Post('/')
  testpost(@Body() body: any) {
  }
}
