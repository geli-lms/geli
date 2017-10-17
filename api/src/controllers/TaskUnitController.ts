import {Body, Post, JsonController, UseBefore, BadRequestError, Authorized} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitBaseController} from './UnitBaseController';
import {TaskUnit} from '../models/units/TaskUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {ITaskModel, Task} from '../models/Task';

@JsonController('/units/tasks')
@UseBefore(passportJwtMiddleware)
export class TaskUnitController extends UnitBaseController {

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
}
