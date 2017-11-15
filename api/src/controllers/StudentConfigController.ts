import {
  BadRequestError, Body, CurrentUser, Get, InternalServerError, JsonController, Param, Authorized, Post, Put,
  UseBefore
} from 'routing-controllers';
import * as moment from 'moment';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {StudentConfig} from '../models/StudentConfig';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../models/Course';

@JsonController('/studentConfig')
@UseBefore(passportJwtMiddleware)
export class StudentConfigController {

  @Authorized(['student'])
  @Get('/user/:id/studentConfig')
  getUnitProgress(@Param('id') id: string) {
    return StudentConfig.find({'_user': id})
      .then((Configs) => Configs.map((studentConfig) => studentConfig.toObject({virtuals: true})));
  }

}
