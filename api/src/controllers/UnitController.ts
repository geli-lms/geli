import {Body, Get, Put, Delete, Param, JsonController, UseBefore, NotFoundError} from 'routing-controllers';
import fs = require('fs');
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {Unit} from '../models/units/Unit';
import {IUnit} from '../../../shared/models/units/IUnit';
import {IVideoUnitModel, VideoUnit} from '../models/units/VideoUnit';
import {IFileUnitModel, FileUnit} from '../models/units/FileUnit';
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
    return Unit.findById(id).then((oldUnit) => {
      if (!oldUnit) {
        throw new NotFoundError();
      }
      // pre update: delete removed files
      if (oldUnit instanceof VideoUnit) {
        (<IVideoUnitModel>oldUnit).files.forEach((file: any) => {
          // if not present in new: delete
          if (!(<IVideoUnitModel>unit).files.some((newFile) => newFile.name === file.name)) {
            try {
              fs.unlinkSync(file.path);
            } catch (e) {
            } // silently discard file not found errors
          }
        });
        return VideoUnit;
      }
      if (oldUnit instanceof FileUnit) {
        (<IFileUnitModel>oldUnit).files.forEach((file: any) => {
          // if not present in new: delete
          if (!(<IFileUnitModel>unit).files.some((newFile) => newFile.name === file.name)) {
            try {
              fs.unlinkSync(file.path);
            } catch (e) {
            } // silently discard file not found errors
          }
        });
        return FileUnit;
      }
      return Unit;
    }).then((model) => model.findByIdAndUpdate(id, unit, {'new': true}))
      .then((u) => u.toObject());
  }

  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    return Unit.findById(id).then((unit) => {
      if (!unit) {
        throw new NotFoundError();
      }

      if (unit instanceof VideoUnit) {
        (<IVideoUnitModel>unit).files.forEach((file: any) => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
          } // silently discard file not found errors
        });

      } else if (unit instanceof TaskUnit) {

        const tasks_to_delete: any = [];
        (<ITaskUnitModel>unit).tasks.forEach((taskId: any) => {
          tasks_to_delete.push(taskId.toString());
        });

        return Promise.all(tasks_to_delete.map(this.task_findByIdAndRemove));
      }

      if (unit instanceof FileUnit) {
        (<IFileUnitModel>unit).files.forEach((file: any) => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
          } // silently discard file not found errors
        });
      }

      return Lecture.update({}, {$pull: {units: id}});
    })
      .then(() => Unit.findByIdAndRemove(id))
      .then(() => {
        return {result: true};
      });
  }

  /**
   * Remove task document
   * @param taskId Is the document id
   * @returns {any} Is the removed task.
   */
  private task_findByIdAndRemove(taskId: any) {
     return Task.findByIdAndRemove(taskId);
  }
}
