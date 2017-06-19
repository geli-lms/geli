import {Body, Post, JsonController, UseBefore, BadRequestError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {TaskUnit} from '../models/units/TaskUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {ITaskModel, Task} from '../models/Task';

@JsonController('/units/tasks')
@UseBefore(passportJwtMiddleware)
export class TaskUnitController extends UnitController {

  @Post('/')
  addTaskUnit(@Body() data: any) {
    // discard invalid requests
    if (!data.lectureId) {
      throw new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.model) {
      throw new BadRequestError('No task unit was submitted.');
    }

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
