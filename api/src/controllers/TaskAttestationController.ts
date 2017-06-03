import {Request} from 'express';
import {Body, Get, Post, Put, Param, Req, JsonController, UseBefore, Delete, HttpError} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

// import {Task} from '../models/Task';
import {TaskAttestation} from '../models/TaskAttestation';
// import {ITask} from '../../../shared/models/ITask';
import {ITaskAttestation} from '../../../shared/models/ITaskAttestation';

@JsonController('/task_attestations')
@UseBefore(passportJwtMiddleware)
export class TaskAttestationController {

  @Get('/')
  getTaskAttestations() {
    return TaskAttestation.find({}).sort({createdAt: -1})
      .then((tasks) => tasks.map((t) => t.toObject()));
  }

  @Get('/:id')
  getTaskAttestation(@Param('id') id: string) {
    return TaskAttestation.findById(id)
      .then((taskAttestation) => taskAttestation.toObject());
  }

  @Post('/')
  addTaskAttestation(@Body() taskAttestation: ITaskAttestation, @Req() request: Request) {
    return new TaskAttestation(taskAttestation).save()
      .then((newTaskAttestation) => newTaskAttestation.toObject());
  }

  @Put('/:id')
  updateTaskAttestation(@Param('id') id: string, @Body() taskAttestation: ITaskAttestation) {
    // console.log('id:' + id);

    // console.log(JSON.stringify(taskAttestation));
    return TaskAttestation.findByIdAndUpdate(id, taskAttestation, {'new': true})
      .then((updatedTaskAttestation) => updatedTaskAttestation.toObject());
  }

  @Delete('/:id')
  deleteTaskAttestation(@Param('id') id: string, @Body() taskAttestation: ITaskAttestation) {
    return TaskAttestation.findByIdAndRemove(id, taskAttestation)
      .then((deletedTaskAttestation) => deletedTaskAttestation.toObject());
  }

  // *************

  @Get('/task/:taskId')
  getTaskAttestationsForTask(@Param('taskId') taskId: string) {
    return TaskAttestation.find().where({taskId: taskId}).sort({createdAt: -1})
      .then((taskAttestations) => taskAttestations.map((t) => t.toObject()));
  }

  // http://mongoosejs.com/docs/queries.html
  @Get('/task/:taskId/user/:userId')
  getTaskAttestationForTaskAndUser(@Param('taskId') taskId: string, @Param('userId') userId: string) {
    // console.log('getTaskAttestationForTaskAndUser');
    // console.log('taskId:' + taskId);
    // console.log('userId:' + userId);
    return TaskAttestation.find().where({taskId: taskId, userId: userId })
      .then((taskAttestations) => taskAttestations.map((t) => t.toObject())); // TODO 404
/*
  .then((existingTaskAttestation) => {
        if (existingTaskAttestation == null) {
          throw new HttpError(404, 'No task attestation found for given task and user.');
        }

        console.log('AAAAAAAAAA' );

        console.log(JSON.stringify(existingTaskAttestation));
        console.log('BBBBBBBBBBB' );
        existingTaskAttestation.map((t) => { t.toObject(); console.log(JSON.stringify(t)); console.log('CCCCCCCC' ); } );
      });
      */
    // {
    // console.log('existingTaskAttestation:' + existingTaskAttestation);
    // console.log(JSON.stringify(existingTaskAttestation));

    // existingTaskAttestation.toObject();
    //  });
  }

  /*


   @Put('/attestation/:id')
   updateTask(@Param('id') id: string, @Body() task: ITask) {
   return Task.findByIdAndUpdate(id, task, {'new': true})
   .then((t) => t.toObject());
   }
   */
}
