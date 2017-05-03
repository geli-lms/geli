import * as mongoose from 'mongoose';
import {ITask} from './ITask';

interface ITaskModel extends ITask, mongoose.Document {
}

const taskSchema = new mongoose.Schema(
      {
        name: {
            type: String
        },
        courseId: {
          type: String
        }
        ,
        answers: [
          {
            value: Boolean,
            text: String
          }
        ]
      }, {
          timestamps: true,
          toObject: {
            transform: function(doc: any, ret: any) {
              ret._id = doc.id;
            }
          }
      }

);


const Task = mongoose.model<ITaskModel>('Task', taskSchema);

export {Task, ITaskModel};
