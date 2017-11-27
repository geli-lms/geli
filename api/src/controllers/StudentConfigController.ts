import {
  NotFoundError, BadRequestError, Body, Get, JsonController, Param, Authorized, Post, Put,
  UseBefore, CurrentUser, Delete
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {StudentConfig} from '../models/StudentConfig';
import {IUser} from '../../../shared/models/IUser';
import {IStudentConfig} from '../../../shared/models/IStudentConfig';

@JsonController('/studentConfig')
@UseBefore(passportJwtMiddleware)
export class StudentConfigController {

  @Authorized(['student'])
  @Get('/:id')
  async getUnitProgress(@Param('id') id: string) {
    const config = await StudentConfig.findOne({'user': id});
        if (!config) {
          throw new NotFoundError();
        }
    return config.toObject({virtuals: true});
  }

  @Authorized(['student'])
  @Post('/')
  async postUnitProgress(@Body() config: IStudentConfig, @CurrentUser() currentUser: IUser) {
    const result = await StudentConfig.findOne({'user': config.user});
      if (result) {
        throw new BadRequestError('Student config already existed');
      }
    if (currentUser._id !== config.user) {
      throw new BadRequestError('Student id does not match');
    }
    const newConfig = await new StudentConfig(config).save();
    return newConfig.toObject();
  }

  @Authorized(['student'])
  @Put('/:id')
  async updateStudentConfig(@Param('id') id: string, @Body() config: IStudentConfig, @CurrentUser() currentUser: IUser) {
    if (currentUser._id !== config.user) {
      throw new BadRequestError('Student id does not match');
    }
    const newConfig = await StudentConfig.findByIdAndUpdate(id, config, {'new': false});
    return newConfig.toObject({virtuals: true});
  }

  @Authorized(['student'])
  @Delete('/:id')
  async deleteConfig(@Param('id') id: string) {
    const config = await StudentConfig.findById(id);
    if (!config) {
      throw new NotFoundError();
    }
    await config.remove();
    return {result: true};
  }
}
