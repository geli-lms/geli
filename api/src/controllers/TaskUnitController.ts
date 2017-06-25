import {
  Body, Post, JsonController, UseBefore, BadRequestError, Put, Param, Delete,
  NotFoundError
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';
import {UnitController} from './UnitController';
import {ITaskUnitModel, TaskUnit} from '../models/units/TaskUnit';
import {ITask} from '../../../shared/models/task/ITask';
import {ITaskModel, Task} from '../models/Task';
import {Unit} from '../models/units/Unit';
import {ITaskUnit} from '../../../shared/models/units/ITaskUnit';

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
    // console.log('######tasks########' + JSON.stringify(tasks));

    return Promise.all(tasks.map(this.addOrUpdateTask))
      .then((savedTasks) => {
        for (let i = 0; i < savedTasks.length; i++) {
          const savedTask: ITaskModel = savedTasks[i];
          data.model.tasks.push(savedTask._id);
        }

        //   console.log('######TaskUnit(data.model).save()########' + JSON.stringify(data.model));

        //   console.log('######@@@2@@@@########');
        return new TaskUnit(data.model).save();

      })
      .then((savedTaskUnit) => {

        //   console.log('######pushToLecture########');
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
      // console.log('######tasks old########' + JSON.stringify( (<ITaskUnitModel>oldTaskUnit)));

      const tasks_to_delete: any = [];

      (<ITaskUnitModel>oldTaskUnit).tasks.forEach((oldTaskId: any) => {
        console.log('**********' + oldTaskId);
        let b = false;
        taskUnit.tasks.forEach((taskId: any) => {
          console.log('*****mmmmmmm*****' + taskId._id);
          if ('' + taskId._id === '' + oldTaskId) {
            b = true;
            //  break;
          }
        });
        if (!b) {
          //    if (taskUnit.tasks.some((newTaskId) => '' + newTaskId._id !== '' + oldTaskId)) {

          tasks_to_delete.push(oldTaskId.toString());
          console.log('*******!!!!***' + oldTaskId);
        }

      });

      return Promise.all(tasks_to_delete.map(this.task_findByIdAndRemove2));

    }).then(() => {
      const tasks: ITask[] = taskUnit.tasks;
      taskUnit.tasks = [];
      console.log('######tasks########' + JSON.stringify(tasks));

      return Promise.all(tasks.map(this.addOrUpdateTask))
        .then((savedTasks) => {
          for (let i = 0; i < savedTasks.length; i++) {
            const savedTask: ITaskModel = savedTasks[i];
            taskUnit.tasks.push(savedTask._id);
          }
          //  console.log('######TaskUnit(data.model).save()########' + JSON.stringify(taskUnit));

          return TaskUnit.findByIdAndUpdate(taskUnit._id, taskUnit, {'new': true})
            .then((updatedTask) => {
              //    console.log('######@@@1@@@@########' + JSON.stringify(updatedTask));
              return updatedTask;
            });
        });

    });
  }

  private task_findByIdAndRemove2(taskId: any) {
    console.log('######task_findByIdAndRemove########' + JSON.stringify(taskId));
    return Task.findByIdAndRemove(taskId);
  }

  private addOrUpdateTask(task: ITask) {
    // console.log('######addTask .save()########' + JSON.stringify(task));

    if (task._id !== undefined) {
      //   console.log('######addTask update########' + JSON.stringify(task));
      return Task.findByIdAndUpdate(task._id, task, {'new': true})
        .then((updatedTask) => {
          return updatedTask;
        });
    } else {
      //    console.log('######addTask new########' + JSON.stringify(task));
      return new Task(task).save();
    }
  }

  deleteTask(@Param('id') id: string) {
    return Task.findById(id).then((task) => {
      if (!task) {
        throw new NotFoundError();
      }
    })
      .then(() => Task.findByIdAndRemove(id))
      .then(() => {
        return {result: true};
      });
  }

}
