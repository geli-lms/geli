import {Request} from 'express';
import {Body, Get, Post, Put, Delete, Param, Req, JsonController, UseBefore, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {FreeTextUnit} from '../models/units/FreeTextUnit';
import {TaskUnit} from '../models/units/TaskUnit';
import {CodeKataUnit} from '../models/units/CodeKataUnit';
import {FileUnit} from '../models/units/FileUnit';
import {VideoUnit} from '../models/units/VideoUnit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {Lecture} from '../models/Lecture';


@JsonController('/duplicate')
@UseBefore(passportJwtMiddleware)
@Authorized(['teacher', 'admin'])
export class DuplicationController {

  @Post('/course/:id')
  duplicateCourse(@Body() data: any, @Req() request: Request) {
    // TODO
  }

  @Post('/lecture/:id')
  duplicateLecture(@Body() data: any, @Req() request: Request) {
    // TODO
    const lectureId = data.model.lectureId;
  }

  @Post('/unit/:id')
  duplicateUnit(@Body() data: any, @Req() request: Request) {
    // TODO
    const unit: IUnit = data.model.unit;
    const lectureId: string = data.model.lectureId;
    this.duplicateUnit(unit)
      .then(newUnit => {
        Lecture.findById(lectureId)
          .then(lecture => {
            lecture.units.push(unit);
        });
      });
  }

  duplicateUnit(unit: IUnit): Promise<any> {
    delete unit._id;
    switch (unit.type) {
      case 'free-text':
        return new FreeTextUnit(unit).save();
      case 'code-kata':
        return new CodeKataUnit(unit).save();
      case 'task':
        if (unit instanceof ITaskUnit) {
          unit.tasks.forEach((task: ITask) => {
            delete task._id;
          });
          return new TaskUnit(unit).save().then((taskUnit: any) => {
            taskUnit.tasks.forEach((task: any) => {
              task.unitId = taskUnit._id;
            })
          });
        }
        break;
      case 'video':
        return new VideoUnit(unit).save();
      case 'file':
        return new FileUnit(unit).save();
    }
  }
}
