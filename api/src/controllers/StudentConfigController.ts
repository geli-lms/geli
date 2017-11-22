import {
  BadRequestError, Body, Get, JsonController, Param, Authorized, Post, Put,
  UseBefore
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {StudentConfig} from '../models/StudentConfig';
import {IStudentConfig} from '../../../shared/models/IStudentConfig';

@JsonController('/studentConfig')
@UseBefore(passportJwtMiddleware)
export class StudentConfigController {

  @Authorized(['student'])
  @Get('/:id')
  getUnitProgress(@Param('id') id: string) {
    return StudentConfig.findOne({'user': id})
      .then((config) => {
        if (!config) {
          throw new BadRequestError('Student config does not exist');
        }
        return config.toObject({virtuals: true})
      });
  }

  @Authorized(['student'])
  @Post('/')
  postUnitProgress(@Body()
                     config: IStudentConfig) {
    return StudentConfig.findOne({'user': config.user}).then(result => {
      if (result) {
          throw new BadRequestError('Student config already existed');
      }
      return new StudentConfig(config).save().then((studentConfig) => studentConfig.toObject());
    });
  }

  @Authorized(['student'])
  @Put('/:id')
  updateStudentConfig(@Param('id')
                        id: string, @Body()
                        config: IStudentConfig) {
    return StudentConfig.findByIdAndUpdate(id, config, {'new': false}).then((Configs) => Configs.toObject({virtuals: true}));
  }
}
