import {
  Body, Post, JsonController, UseBefore, BadRequestError, Put, Param, Delete,
  NotFoundError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {ITaskUnitModel, TaskUnit} from '../models/units/TaskUnit';
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
    if (!data.lectureId) {
      throw new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.model) {
      throw new BadRequestError('No task unit was submitted.');
    }

    const tasks: ITask[] = data.model.tasks;
    data.model.tasks = [];

    return Promise.all(tasks.map(this.addOrUpdateTask))
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

  @Put('/:id')
  updateTaskUnit(@Param('id') id: string, @Body() taskUnit: ITaskUnit) {
    if (!id) {
      throw new BadRequestError('No task unit ID was submitted.');
    }

    return TaskUnit.findById(id).then((oldTaskUnit) => {
      if (!oldTaskUnit) {
        throw new NotFoundError();
      }

      const tasks_to_delete: any = [];

      (<ITaskUnitModel>oldTaskUnit).tasks.forEach((oldTaskId: any) => {
        let b = false;
        taskUnit.tasks.forEach((taskId: any) => {
          if ('' + taskId._id === '' + oldTaskId) {
            b = true;
          }
        });
        if (!b) {
          tasks_to_delete.push(oldTaskId.toString());
        }

      });

      return Promise.all(tasks_to_delete.map(this.task_findByIdAndRemove2));

    }).then(() => {
      const tasks: ITask[] = taskUnit.tasks;
      taskUnit.tasks = [];

      return Promise.all(tasks.map(this.addOrUpdateTask))
        .then((savedTasks) => {
          for (let i = 0; i < savedTasks.length; i++) {
            const savedTask: ITaskModel = savedTasks[i];
            taskUnit.tasks.push(savedTask._id);
          }

          return TaskUnit.findByIdAndUpdate(taskUnit._id, taskUnit, {'new': true})
            .then((updatedTask) => {
              return updatedTask;
            });
        });

    });
  }

  /**
   * Remove task document
   * @param taskId Is the document id
   * @returns {any} Is the removed task.
   */
  private task_findByIdAndRemove2(taskId: any) {
   return Task.findByIdAndRemove(taskId);
  }

  /**
   * Add new or change existing task document
   * @param task Is the document
   * @returns {any} Is the saved task.
   */
  private addOrUpdateTask(task: ITask) {

    if (task._id !== undefined) {
      return Task.findByIdAndUpdate(task._id, task, {'new': true})
        .then((updatedTask) => {
          return updatedTask;
        });
    } else {
      return new Task(task).save();
    }
  }

}
