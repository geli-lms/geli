import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, Delete} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Task} from '../models/Task';
import {ITask} from '../../../shared/models/task/ITask';
import {Unit} from '../models/units/Unit';
import {TaskAttestation} from '../models/TaskAttestation';
// import {ITask} from '../../../shared/models/ITask';
import {ITaskAttestation} from '../../../shared/models/ITaskAttestation';

@JsonController('/tasks')
@UseBefore(passportJwtMiddleware)
export class TaskController {

  @Get('/')
  getTasks() {
    return Task.find({}).sort({ createdAt: -1 })
      .then((tasks) => tasks.map((t) => t.toObject()));
  }

  @Get('/:id')
  getTask(@Param('id') id: string) {
    return Task.findById(id)
      .then((task) => task.toObject());
  }

  @Post('/')
  addTask(@Body() task: ITask, @Req() request: Request) {
    return new Task(task).save()
      .then((newTask) => newTask.toObject());
  }

  @Put('/:id')
  updateTask(@Param('id') id: string, @Body() task: ITask) {
    return Task.findByIdAndUpdate(id, task, {'new': true})
      .then((updatedTask) => updatedTask.toObject());
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @Body() task: ITask) {
   return Task.findByIdAndRemove(id, task)
      .then((deletedTask) => deletedTask.toObject());
  }

  // *************

  @Get('/course/:courseId')
  getTasksForCourse(@Param('courseId') courseId: string) {
    return Task.find().where({ courseId: courseId }).sort({ createdAt: -1 })
      .then((tasks) => tasks.map((t) => t.toObject()));
  }

}
