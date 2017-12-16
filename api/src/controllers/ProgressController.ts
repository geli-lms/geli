import {
  Authorized,
  BadRequestError, Body, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put,
  UseBefore
} from 'routing-controllers';
import * as moment from 'moment';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {IProgressModel, Progress} from '../models/Progress';
import {IUser} from '../../../shared/models/IUser';
import {IUnitModel, Unit} from '../models/units/Unit';
import {UnitClassMapper} from '../utilities/UnitClassMapper';

@JsonController('/progress')
@UseBefore(passportJwtMiddleware)
export class ProgressController {
  private static async getUnit(unitId: string): Promise<IUnitModel> {
    return (await Unit.findById(unitId));
  }

  private static checkDeadline(unit: any) {
    if (unit.deadline && moment(unit.deadline).isBefore()) {
      throw new BadRequestError('Past deadline, no further update possible');
    }
  }

  @Get('/units/:id')
  getUnitProgress(@Param('id') id: string) {
    return Progress.find({'unit': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Get('/courses/:id')
  getCourseProgress(@Param('id') id: string) {
    return Progress.find({'course': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Get('/users/:id')
  getUserProgress(@Param('id') id: string) {
    return Progress.find({'user': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }

  @Post('/')
  async createProgress(@Body() data: any, @CurrentUser() currentUser?: IUser) {
    // discard invalid requests
    if (!data.course || !data.unit || !currentUser) {
      throw new BadRequestError('progress need fields course, user and unit');
    }
    const unit: any = await ProgressController.getUnit(data.unit);
    ProgressController.checkDeadline(unit);

    data.user = currentUser;

    const progressClass = UnitClassMapper.getProgressClassForUnit(unit);
    const progress = await new progressClass(data).save();

    return progress.toObject();
  }

  @Put('/:id')
  async updateProgress(@Param('id') id: string, @Body() data: any) {
    const progress = await Progress.findById(id);

    if (!progress) {
      throw new NotFoundError();
    }

    const unit: any = await ProgressController.getUnit(progress.unit);
    ProgressController.checkDeadline(unit);

    progress.set(data);
    await progress.save();

    return progress.toObject();
  }
}
