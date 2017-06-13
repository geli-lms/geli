import * as mongoose from 'mongoose';
import {Get, JsonController, Param} from 'routing-controllers';
import {Progress} from '../models/Progress';
import {Unit} from '../models/units/Unit';
import {User} from '../models/User';

@JsonController('/progress')
export class ProgressController {

  @Get('/courses/:id')
  getCourseProgress(@Param('id') id: string) {
    return Progress.aggregate([
      { $match: { 'course': new mongoose.Types.ObjectId(id)}},
      {
        $lookup: {
          from: 'units', localField: 'unit', foreignField: '_id', as: 'unit',
        }
      },
      { $unwind: '$unit' },
      { $project: {
        'unit': {
          '_id': 1
        },
        'done': 1
      }}
    ]);
  }

  @Get('/users/:id')
  getUserProgress(@Param('id') id: string) {
    return Progress.find({'user': id})
      .then((progresses) => progresses.map((progress) => progress.toObject({virtuals: true})));
  }
}
