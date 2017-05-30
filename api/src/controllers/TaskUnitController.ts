import {Body, Post, JsonController, UseBefore} from 'routing-controllers';
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
      return;
    }

    if (!data.taskUnit) {
      return;
    }

    const tasks: ITask[] = data.taskUnit.tasks;
    data.taskUnit.tasks = [];

    return Promise.all(tasks.map(this.addTask))
      .then((savedTasks) => {
        for (let i = 0; i < savedTasks.length; i++) {
          const savedTask: ITaskModel = savedTasks[i];
          data.taskUnit.tasks.push(savedTask._id);
        }

        return new TaskUnit(data.taskUnit).save();
      })
      .then((savedTaskUnit) => {
        this.pushToLecture(data.lectureId, savedTaskUnit);
      });
  }

  private addTask(task: ITask) {
    return new Task(task).save();
  }
}
