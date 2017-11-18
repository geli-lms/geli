import {
  BadRequestError, Body, CurrentUser, Get, InternalServerError, JsonController, Param, Authorized, Post, Put,
  UseBefore
} from 'routing-controllers';
import * as moment from 'moment';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {StudentConfig, studentConfigSchema} from '../models/StudentConfig';
import {IUser} from '../../../shared/models/IUser';
import {Course} from '../models/Course';
import {IStudentConfig} from '../../../shared/models/IStudentConfig';

@JsonController('/studentConfig')
//@UseBefore(passportJwtMiddleware)
export class StudentConfigController {

 // @Authorized(['student'])
  @Get('/:id')
  getUnitProgress(@Param('id') id: string) {
    return StudentConfig.find({'_user': id})
      .then((Configs) => Configs.map((studentConfig) => studentConfig.toObject({virtuals: true})));
  }

 // @Authorized(['student'])
  @Post('/')
  postUnitProgress(@Param('config') config: IStudentConfig) {
        return StudentConfig.findOne(config.user).then((studentConfig) => {
      if (studentConfig) {
          throw new BadRequestError('Student config already existed');
      }
          return new StudentConfig(studentConfig).save();
        });
    }

 // @Authorized(['student'])
  @Put('/user/:id/studentConfig')
  updateStudentConfig(@Param('config') config: IStudentConfig) {
    return StudentConfig.findByIdAndUpdate(config.user, config, {'new': true});
  }
}
