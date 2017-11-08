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
      .then((course) => course.serialize());
  }

  @Post('/')
  testpost(@Body() body: any) {
    return new Course().deserialize(body).then((course) => course.toObject());
  }
}
