import {Body, Post, Put, Param, JsonController, UseBefore, BadRequestError, Authorized, Get} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {TaskUnit} from '../models/units/TaskUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {ITaskModel, Task} from '../models/Task';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';

@JsonController('/units/tasks')
@UseBefore(passportJwtMiddleware)
export class TaskUnitController extends UnitController {

  @Authorized(['teacher', 'admin'])
  @Post('/')
  addTaskUnit(@Body() data: any) {
    // discard invalid requests
    this.checkPostParam(data);

    const tasks: ITask[] = data.model.tasks;
    data.model.tasks = [];

    return Promise.all(tasks.map(this.addTask))
      .then((savedTasks) => {
        for (let i = 0; i < savedTasks.length; i++) {
          const savedTask: ITaskModel = savedTasks[i];
          data.model.tasks.push(savedTask._id);
        }

        return new TaskUnit(data.model).save();
      })
      .then((savedTaskUnit) => {
        return this.pushToLecture(data.lectureId, savedTaskUnit);
      });
  }

  private addTask(task: ITask) {
    return new Task(task).save();
  }

  /*
  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  async updateUnit(@Param('id') id: string, @Body() unit: ITaskUnit) {
    if (unit.tasks) {
      unit.tasks = await Promise.all(unit.tasks.map((task) => {
        // update task if exists
        if (task._id) {
          return Task.findByIdAndUpdate(task._id, task, {'new': true});
        }

        return new Task(task).save();
      }));
    }

    return TaskUnit.findByIdAndUpdate(id, unit, {'new': true})
      .then((u) => u.toObject());
  }
  */

  @Authorized(['teacher', 'admin'])
  @Get('/:id')
  getTaskUnit(@Param('id') id: string) {
    return TaskUnit.findById(id)
      .populate({
        path: 'tasks',
      })
      .then((u) => u.toObject());
  }

}
