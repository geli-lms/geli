import {
  Body, Get, Put, Post, Delete, Param, JsonController, UseBefore, UploadedFile,
  NotFoundError
} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IVideoUnitModel, VideoUnit} from '../models/units/VideoUnit';
import {ITaskUnitModel, TaskUnit} from '../models/units/TaskUnit';
import {IVideoUnit} from '../../../shared/models/units/IVideoUnit';
// import {TaskUnit} from "../../../app/webFrontend/src/app/models/TaskUnit";
import {ITaskModel, Task} from '../models/Task';

const uploadOptions = {dest: 'uploads/'};

@JsonController('/units')
@UseBefore(passportJwtMiddleware)
export class UnitController {

  @Get('/:id')
  getUnit(@Param('id') id: string) {
    return Unit.findById(id)
      .then((u) => u.toObject());
  }
/*
  protected updateToLecture(lectureId: string, unit: any) {
    return Lecture.findById(lectureId)
      .then((lecture) => {
        return lecture.save();
      })
      .then((lecture) => lecture.toObject());
  }
*/
  protected pushToLecture(lectureId: string, unit: any) {
    return Lecture.findById(lectureId)
      .then((lecture) => {
        lecture.units.push(unit);
        return lecture.save();
      })
      .then((lecture) => lecture.toObject());
  }

  @Put('/:id')
  updateUnit(@Param('id') id: string, @Body() unit: IUnit) {
    return Unit.findByIdAndUpdate(id, unit, {'new': true})
      .then((u) => u.toObject());
  }

  /*
   return Unit.findById(id).then((oldUnit) => {
   if (!oldUnit) {
   throw new NotFoundError();
   }
   console.log('qqqqqqqq oldUnit qqqqqqqq' + JSON.stringify(oldUnit));
   console.log('qqqqqqqq unit qqqqqqqq' + JSON.stringify(unit));
   if (oldUnit instanceof TaskUnit) {
   (<ITaskUnitModel>oldUnit).tasks.forEach((task: any) => {
   // if not present in new: delete
   if (!(<ITaskUnitModel>unit).tasks.some((newTask) => newTask._id === task._id)) {
   console.log('**********' + task._id);
   } else {
   } console.log('****________******' + task._id);
   });
   return TaskUnit;
   }
   return Unit;
   }).then((model) => {
   return model.findByIdAndUpdate(id, unit, {'new': true});
   }).then((u) => {
   console.log(u);
   return u;
   })
   .then((u) => u.toObject());
   }*/

  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    return Unit.findById(id).then((unit) => {
      if (!unit) {
        throw new NotFoundError();
      }
      // console.log('**********');
      if (unit instanceof VideoUnit && (<IVideoUnitModel>unit).filePath) {
        fs.unlinkSync((<IVideoUnitModel>unit).filePath);
      } else if (unit instanceof TaskUnit) {

        const tasks_to_delete: any = [];
        (<ITaskUnitModel>unit).tasks.forEach((taskId: any) => {
          tasks_to_delete.push(taskId.toString());
        });

        return Promise.all(tasks_to_delete.map(this.task_findByIdAndRemove));

        //  return Promise.all((<ITaskUnitModel>unit).tasks).map(this.task_findByIdAndRemove)).then(() => {
        //  return {result: true};
       //   });

        /*
         console.log('###' + JSON.stringify((<ITaskUnitModel>unit).tasks));
         for (let i = 0; i < (<ITaskUnitModel>unit).tasks.length; i++) {
         console.log('_____' + (<ITaskUnitModel>unit).tasks[i]);

         return Task.findByIdAndRemove((<ITaskUnitModel>unit).tasks[i]); // TODO make it as promise

         }*/

      }
      return Lecture.update({}, {$pull: {units: id}});
    })
     // .then(() => {
     //   if (unit instanceof TaskUnit) {
     //   } else {
     //     return {result: true};
      //  }
     // })
        .then(() => Unit.findByIdAndRemove(id))
      .then(() => {
        return {result: true};
      });
  }

  private task_findByIdAndRemove(taskId: any) {
    console.log('######task_findByIdAndRemove########' + JSON.stringify(taskId));
    return Task.findByIdAndRemove(taskId);
  }
}
